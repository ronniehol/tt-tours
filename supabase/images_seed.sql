-- TT Tours — Tour Images Seed
-- Uses slug lookups so it's safe to run after any fresh schema+seed.
-- Safe to re-run: conflicts on (tour_id, is_cover) are ignored.

INSERT INTO tour_images (tour_id, url, alt, is_cover, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1734432596388-a35024838aab?w=1200&q=80', 'My Son Sanctuary ancient Cham temples', true, 0
FROM tours WHERE slug = 'my-son-sanctuary'
ON CONFLICT DO NOTHING;

INSERT INTO tour_images (tour_id, url, alt, is_cover, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1741138327956-dfa75763b50d?w=1200&q=80', 'Ba Na Hill Golden Bridge giant stone hands', true, 0
FROM tours WHERE slug = 'ba-na-hill'
ON CONFLICT DO NOTHING;

INSERT INTO tour_images (tour_id, url, alt, is_cover, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1551696574-bf6016b8810f?w=1200&q=80', 'Marble Mountain Buddhist caves Da Nang', true, 0
FROM tours WHERE slug = 'marble-mountain'
ON CONFLICT DO NOTHING;

INSERT INTO tour_images (tour_id, url, alt, is_cover, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1741762473772-65841c638549?w=1200&q=80', 'Cham Island crystal clear water snorkeling', true, 0
FROM tours WHERE slug = 'cham-island'
ON CONFLICT DO NOTHING;

INSERT INTO tour_images (tour_id, url, alt, is_cover, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1741317375127-1c2fab33bb78?w=1200&q=80', 'Hue Imperial Citadel traditional architecture', true, 0
FROM tours WHERE slug = 'hue-city-tour'
ON CONFLICT DO NOTHING;

INSERT INTO tour_images (tour_id, url, alt, is_cover, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1536086845112-89de23aa4772?w=1200&q=80', 'Cham Museum Da Nang city', true, 0
FROM tours WHERE slug = 'cham-museum-han-market'
ON CONFLICT DO NOTHING;

INSERT INTO tour_images (tour_id, url, alt, is_cover, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1480742440191-ab4ea2aac8e7?w=1200&q=80', 'Basket boat bamboo coracle Hoi An waterway', true, 0
FROM tours WHERE slug = 'basket-boat-tour'
ON CONFLICT DO NOTHING;

INSERT INTO tour_images (tour_id, url, alt, is_cover, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1489786102881-d830f187e483?w=1200&q=80', 'Vespa scooter night ride Hoi An lanterns', true, 0
FROM tours WHERE slug = 'vespa-tour'
ON CONFLICT DO NOTHING;

INSERT INTO tour_images (tour_id, url, alt, is_cover, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1682687981907-170c006e3744?w=1200&q=80', 'Scuba diving coral reef South China Sea', true, 0
FROM tours WHERE slug = 'diving-tour'
ON CONFLICT DO NOTHING;

INSERT INTO tour_images (tour_id, url, alt, is_cover, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1707235163517-aafbac576733?w=1200&q=80', 'Cycling rice paddies Hoi An countryside', true, 0
FROM tours WHERE slug = 'hoi-an-bike-tour'
ON CONFLICT DO NOTHING;

INSERT INTO tour_images (tour_id, url, alt, is_cover, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1506424482693-1f123321fa53?w=1200&q=80', 'Motorbike easy rider Vietnam countryside', true, 0
FROM tours WHERE slug = 'easy-rider-tour'
ON CONFLICT DO NOTHING;

INSERT INTO tour_images (tour_id, url, alt, is_cover, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1760894192884-37a7037200ba?w=1200&q=80', 'Traditional pottery wheel Thanh Ha village', true, 0
FROM tours WHERE slug = 'thanh-ha-pottery-village'
ON CONFLICT DO NOTHING;

INSERT INTO tour_images (tour_id, url, alt, is_cover, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1514864151880-d1bef4892f29?w=1200&q=80', 'Tra Que organic herb village farming Hoi An', true, 0
FROM tours WHERE slug = 'tra-que-herb-village'
ON CONFLICT DO NOTHING;

INSERT INTO tour_images (tour_id, url, alt, is_cover, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1701396173275-835886dd72ce?w=1200&q=80', 'Dragon Bridge Da Nang city night', true, 0
FROM tours WHERE slug = 'marble-mountain-danang-city'
ON CONFLICT DO NOTHING;
