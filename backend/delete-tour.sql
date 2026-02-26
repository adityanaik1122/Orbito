-- Delete the Windsor Stonehenge tour
DELETE FROM tours 
WHERE slug = 'windsor-stonehenge-bath-pub-lunch';

-- Verify it's deleted
SELECT COUNT(*) as remaining_tours FROM tours;
