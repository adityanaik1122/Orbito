-- Update Windsor Stonehenge tour with image
UPDATE tours 
SET main_image = 'https://images.unsplash.com/photo-1599833975787-5d9f111d0e7a?w=800&q=80',
    images = ARRAY['https://images.unsplash.com/photo-1599833975787-5d9f111d0e7a?w=800&q=80']
WHERE slug = 'windsor-stonehenge-bath-pub-lunch';

-- Verify the update
SELECT id, slug, title, main_image FROM tours WHERE slug = 'windsor-stonehenge-bath-pub-lunch';
