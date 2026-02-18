-- Affiliate Tracking Schema
-- This creates tables to track affiliate clicks, conversions, and commissions

-- 1. Affiliate Links Table
CREATE TABLE IF NOT EXISTS affiliate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL, -- 'getyourguide', 'viator', etc.
  tour_id TEXT NOT NULL,
  tour_title TEXT,
  destination TEXT,
  affiliate_url TEXT NOT NULL,
  tracking_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Affiliate Clicks Table
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_code TEXT NOT NULL,
  provider TEXT NOT NULL,
  tour_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  
  FOREIGN KEY (tracking_code) REFERENCES affiliate_links(tracking_code)
);

-- 3. Affiliate Conversions Table
CREATE TABLE IF NOT EXISTS affiliate_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_code TEXT NOT NULL,
  click_id UUID REFERENCES affiliate_clicks(id),
  provider TEXT NOT NULL,
  tour_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  
  -- Booking details
  booking_reference TEXT,
  booking_date DATE,
  travel_date DATE,
  
  -- Financial details
  booking_amount DECIMAL(10, 2),
  currency TEXT DEFAULT 'GBP',
  commission_rate DECIMAL(5, 2), -- e.g., 8.5 for 8.5%
  commission_amount DECIMAL(10, 2),
  
  -- Status tracking
  status TEXT DEFAULT 'pending', -- pending, confirmed, paid, cancelled
  confirmed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  FOREIGN KEY (tracking_code) REFERENCES affiliate_links(tracking_code)
);

-- 4. Commission Payments Table
CREATE TABLE IF NOT EXISTS commission_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  payment_period_start DATE NOT NULL,
  payment_period_end DATE NOT NULL,
  total_conversions INTEGER DEFAULT 0,
  total_commission DECIMAL(10, 2) DEFAULT 0,
  currency TEXT DEFAULT 'GBP',
  status TEXT DEFAULT 'pending', -- pending, processing, paid
  paid_at TIMESTAMPTZ,
  payment_reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_tracking_code ON affiliate_clicks(tracking_code);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_clicked_at ON affiliate_clicks(clicked_at);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_tracking_code ON affiliate_conversions(tracking_code);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_status ON affiliate_conversions(status);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_provider ON affiliate_conversions(provider);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_created_at ON affiliate_conversions(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for affiliate_conversions
CREATE TRIGGER update_affiliate_conversions_updated_at
  BEFORE UPDATE ON affiliate_conversions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- View for commission dashboard
CREATE OR REPLACE VIEW commission_dashboard AS
SELECT 
  provider,
  COUNT(*) as total_conversions,
  SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_conversions,
  SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_conversions,
  SUM(booking_amount) as total_booking_value,
  SUM(commission_amount) as total_commission,
  SUM(CASE WHEN status = 'confirmed' THEN commission_amount ELSE 0 END) as confirmed_commission,
  SUM(CASE WHEN status = 'paid' THEN commission_amount ELSE 0 END) as paid_commission,
  AVG(commission_rate) as avg_commission_rate,
  DATE_TRUNC('month', created_at) as month
FROM affiliate_conversions
GROUP BY provider, DATE_TRUNC('month', created_at)
ORDER BY month DESC, provider;

-- View for click-through rates
CREATE OR REPLACE VIEW affiliate_performance AS
SELECT 
  al.provider,
  al.tour_id,
  al.tour_title,
  al.destination,
  COUNT(DISTINCT ac.id) as total_clicks,
  COUNT(DISTINCT acv.id) as total_conversions,
  CASE 
    WHEN COUNT(DISTINCT ac.id) > 0 
    THEN ROUND((COUNT(DISTINCT acv.id)::DECIMAL / COUNT(DISTINCT ac.id) * 100), 2)
    ELSE 0 
  END as conversion_rate,
  SUM(acv.commission_amount) as total_commission
FROM affiliate_links al
LEFT JOIN affiliate_clicks ac ON al.tracking_code = ac.tracking_code
LEFT JOIN affiliate_conversions acv ON al.tracking_code = acv.tracking_code
GROUP BY al.provider, al.tour_id, al.tour_title, al.destination
ORDER BY total_clicks DESC;
