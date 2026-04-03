-- ============================================================
-- TT-Tours: tour_translations table + seed data
-- Paste into Supabase SQL editor and run.
-- ============================================================

-- 1. TABLE DEFINITION
-- ============================================================
CREATE TABLE IF NOT EXISTS tour_translations (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id           uuid REFERENCES tours(id) ON DELETE CASCADE,
  language          text NOT NULL CHECK (language IN ('vi', 'zh', 'ru')),
  name              text NOT NULL,
  short_description text,
  description       text,
  highlights        text[],
  included          text[],
  excluded          text[],
  meeting_point     text,
  UNIQUE(tour_id, language)
);

ALTER TABLE tour_translations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tour translations are publicly readable" ON tour_translations;
CREATE POLICY "Tour translations are publicly readable"
  ON tour_translations FOR SELECT USING (true);

GRANT SELECT ON tour_translations TO anon;


-- 2. TRANSLATIONS
-- ============================================================

-- -------------------------------------------------------
-- TOUR: my-son-sanctuary  |  language: vi
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'vi',
  'Thánh Địa Mỹ Sơn',
  'Những ngôi đền Chăm cổ ẩn mình trong thung lũng sông rừng rậm.',
  'Khám phá những tàn tích huyền bí của Mỹ Sơn, một quần thể đền Hindu được xây dựng từ thế kỷ 4 đến thế kỷ 14 bởi Vương quốc Chăm Pa. Tọa lạc trong một thung lũng rừng rậm cách Hội An 70km, Di sản Thế giới UNESCO này là một trong những địa điểm khảo cổ quan trọng nhất Việt Nam.',
  ARRAY[
    'Di sản Thế giới UNESCO',
    'Hơn 70 tháp đền Chăm cổ đại',
    'Hướng dẫn viên nói tiếng Anh chuyên nghiệp',
    'Biểu diễn múa Chăm truyền thống'
  ],
  ARRAY[
    'Xe đưa đón có máy lạnh',
    'Hướng dẫn viên tiếng Anh',
    'Vé vào cửa',
    'Nước uống đóng chai'
  ],
  ARRAY[
    'Bữa trưa',
    'Chi phí cá nhân',
    'Tiền tip'
  ],
  'Đón tại khách sạn ở Hội An / Đà Nẵng'
FROM tours WHERE slug = 'my-son-sanctuary'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: my-son-sanctuary  |  language: zh
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'zh',
  '美山圣地',
  '隐藏在茂密河谷森林中的古代占婆神庙。',
  '探索美山神秘的遗址，这是一座由占婆王国在公元4至14世纪建造的印度教神庙群。距会安70公里，深藏于茂密的山谷之中，这处联合国教科文组织世界遗产是越南最重要的考古遗址之一。',
  ARRAY[
    '联合国教科文组织世界遗产',
    '70余座古代占婆塔庙',
    '专业英语导游',
    '传统占婆舞蹈表演'
  ],
  ARRAY[
    '空调接送车',
    '英语导游',
    '门票',
    '瓶装水'
  ],
  ARRAY[
    '午餐',
    '个人消费',
    '小费'
  ],
  '会安 / 岘港酒店接送'
FROM tours WHERE slug = 'my-son-sanctuary'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: my-son-sanctuary  |  language: ru
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'ru',
  'Святилище Милайн',
  'Древние храмы Чамов, скрытые в лесистой речной долине.',
  'Исследуйте мистические руины Милайна — комплекс индуистских храмов, построенных между IV и XIV веками Королевством Чампа. Расположенный в густом лесу в 70 км от Хойана, этот объект Всемирного наследия ЮНЕСКО является одним из важнейших археологических памятников Вьетнама.',
  ARRAY[
    'Объект Всемирного наследия ЮНЕСКО',
    'Более 70 древних башенных храмов Чамов',
    'Профессиональный гид, говорящий по-английски',
    'Традиционное танцевальное представление Чам'
  ],
  ARRAY[
    'Трансфер на кондиционированном транспорте',
    'Англоязычный гид',
    'Входные билеты',
    'Питьевая вода в бутылках'
  ],
  ARRAY[
    'Обед',
    'Личные расходы',
    'Чаевые'
  ],
  'Трансфер от отеля в Хойане / Дананге'
FROM tours WHERE slug = 'my-son-sanctuary'
ON CONFLICT (tour_id, language) DO NOTHING;


-- -------------------------------------------------------
-- TOUR: ba-na-hill  |  language: vi
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'vi',
  'Bà Nà Hills',
  'Đi cáp treo kỷ lục thế giới lên cây Cầu Vàng huyền thoại.',
  'Bà Nà Hills là khu nghỉ dưỡng trên núi tuyệt đẹp ở độ cao 1.487m so với mực nước biển, cách Đà Nẵng 40km. Đi cáp treo một chiều dài nhất và cao nhất thế giới để lên đỉnh, sau đó khám phá cây Cầu Vàng nổi tiếng được đỡ bởi những bàn tay đá khổng lồ.',
  ARRAY[
    'Cáp treo kỷ lục thế giới (5.801m)',
    'Cầu Vàng huyền thoại',
    'Làng Pháp & Fantasy Park',
    'Tầm nhìn toàn cảnh Đà Nẵng'
  ],
  ARRAY[
    'Xe đưa đón khứ hồi',
    'Vé cáp treo',
    'Hướng dẫn viên',
    'Vé vào cửa'
  ],
  ARRAY[
    'Bữa trưa',
    'Các trò chơi trong Fantasy Park',
    'Chi phí cá nhân'
  ],
  'Đón tại khách sạn ở Hội An / Đà Nẵng'
FROM tours WHERE slug = 'ba-na-hill'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: ba-na-hill  |  language: zh
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'zh',
  '巴拿山',
  '乘坐世界纪录缆车，前往标志性的金桥。',
  '巴拿山是一座壮观的山地度假村，海拔1,487米，距岘港仅40公里。乘坐世界上最长、最高的不间断缆车抵达山顶，探索由巨型石手托举的非凡金桥。',
  ARRAY[
    '世界纪录缆车（5,801米）',
    '标志性金桥',
    '法式村庄与梦幻乐园',
    '俯瞰岘港的全景视野'
  ],
  ARRAY[
    '往返接送',
    '缆车票',
    '导游',
    '门票'
  ],
  ARRAY[
    '午餐',
    '梦幻乐园游乐项目',
    '个人消费'
  ],
  '会安 / 岘港酒店接送'
FROM tours WHERE slug = 'ba-na-hill'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: ba-na-hill  |  language: ru
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'ru',
  'Ба На Хиллс',
  'Прокатитесь на канатной дороге — рекордсмене Книги рекордов Гиннесса — к знаменитому Золотому мосту.',
  'Ба На Хиллс — это захватывающий горный курорт на высоте 1487 м над уровнем моря, в 40 км от Дананга. Поднимитесь на самой длинной и высокой в мире непрерывной канатной дороге, а затем полюбуйтесь удивительным Золотым мостом, поддерживаемым гигантскими каменными руками.',
  ARRAY[
    'Канатная дорога — мировой рекорд (5801 м)',
    'Культовый Золотой мост',
    'Французская деревня и Парк фантазий',
    'Панорамный вид на Дананг'
  ],
  ARRAY[
    'Трансфер туда-обратно',
    'Билеты на канатную дорогу',
    'Гид',
    'Входные билеты'
  ],
  ARRAY[
    'Обед',
    'Аттракционы в Парке фантазий',
    'Личные расходы'
  ],
  'Трансфер от отеля в Хойане / Дананге'
FROM tours WHERE slug = 'ba-na-hill'
ON CONFLICT (tour_id, language) DO NOTHING;


-- -------------------------------------------------------
-- TOUR: marble-mountain  |  language: vi
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'vi',
  'Ngũ Hành Sơn',
  'Năm đỉnh đá vôi với những hang động linh thiêng và tầm nhìn ra thành phố.',
  'Ngũ Hành Sơn là một cụm năm ngọn núi đá cẩm thạch và đá vôi nằm ngay phía nam Đà Nẵng. Leo qua các đền thờ Phật giáo linh thiêng, những hang động ẩn bí và lên đỉnh để có tầm nhìn bao quát ra Bãi biển Trung và Biển Đông.',
  ARRAY[
    'Hang động và đền thờ Phật giáo linh thiêng',
    'Tầm nhìn toàn cảnh bãi biển Đà Nẵng',
    'Năm ngọn núi đá cẩm thạch theo ngũ hành',
    'Làng nghề đá cẩm thạch lân cận'
  ],
  ARRAY[
    'Xe đưa đón',
    'Hướng dẫn viên',
    'Vé vào cửa'
  ],
  ARRAY[
    'Vé thang máy (2 USD)',
    'Chi phí mua sắm cá nhân'
  ],
  'Đón tại khách sạn ở Hội An / Đà Nẵng'
FROM tours WHERE slug = 'marble-mountain'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: marble-mountain  |  language: zh
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'zh',
  '五行山',
  '五座石灰岩山峰，拥有神圣洞穴和城市全景。',
  '五行山是位于岘港以南的五座大理石和石灰岩山丘群。穿越神圣的佛教圣殿和隐秘洞穴，登顶后可俯瞰中国海滩和南海的壮阔景色。',
  ARRAY[
    '神圣的佛教洞穴和神祠',
    '俯瞰岘港海滩的全景',
    '五行元素大理石山峰',
    '附近的大理石工艺品村'
  ],
  ARRAY[
    '接送车',
    '导游',
    '门票'
  ],
  ARRAY[
    '电梯票（2美元）',
    '个人购物'
  ],
  '会安 / 岘港酒店接送'
FROM tours WHERE slug = 'marble-mountain'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: marble-mountain  |  language: ru
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'ru',
  'Мраморные горы',
  'Пять известняковых вершин со священными пещерами и панорамой города.',
  'Мраморные горы — это группа из пяти мраморных и известняковых холмов к югу от Дананга. Поднимитесь через священные буддийские святилища и скрытые пещеры, чтобы с вершины насладиться захватывающим видом на пляж Чайна Бич и Южно-Китайское море.',
  ARRAY[
    'Священные буддийские пещеры и святилища',
    'Панорамный вид на пляжи Дананга',
    'Пять мраморных вершин, символизирующих стихии',
    'Рядом расположена деревня мраморных ремёсел'
  ],
  ARRAY[
    'Трансфер',
    'Гид',
    'Входные билеты'
  ],
  ARRAY[
    'Билет на лифт (2 USD)',
    'Личные покупки'
  ],
  'Трансфер от отеля в Хойане / Дананге'
FROM tours WHERE slug = 'marble-mountain'
ON CONFLICT (tour_id, language) DO NOTHING;


-- -------------------------------------------------------
-- TOUR: cham-island  |  language: vi
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'vi',
  'Đảo Cù Lao Chàm',
  'Làn nước trong vắt, rạn san hô và hải sản tươi ngon ngoài khơi Hội An.',
  'Cù Lao Chàm là Khu Dự trữ Sinh quyển UNESCO chỉ cách Hội An 15km về phía ngoài khơi. Đi tàu cao tốc vượt Biển Đông trong xanh, rồi dành cả ngày lặn ngắm rạn san hô rực rỡ và thưởng thức hải sản đánh bắt tươi sống.',
  ARRAY[
    'Khu Dự trữ Sinh quyển UNESCO',
    'Lặn ngắm rạn san hô',
    'Vượt biển bằng tàu cao tốc',
    'Bữa trưa hải sản tươi trên bãi biển'
  ],
  ARRAY[
    'Vé tàu cao tốc khứ hồi',
    'Thiết bị lặn ngắm san hô',
    'Bữa trưa hải sản',
    'Áo phao',
    'Hướng dẫn viên'
  ],
  ARRAY[
    'Đồ uống thêm',
    'Chi phí cá nhân'
  ],
  'Bến thuyền Hội An (Bãi An Bàng)'
FROM tours WHERE slug = 'cham-island'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: cham-island  |  language: zh
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'zh',
  '占婆岛',
  '会安近海的清澈水域、珊瑚礁与新鲜海鲜。',
  '占婆岛（瞿劳占岛）是距会安仅15公里的联合国教科文组织生物圈保护区。乘坐快艇穿越清澈的南海，在明艳的珊瑚礁间浮潜，享用新鲜捕捞的海鲜。',
  ARRAY[
    '联合国教科文组织生物圈保护区',
    '珊瑚礁浮潜',
    '快艇穿越',
    '海滩上的新鲜海鲜午餐'
  ],
  ARRAY[
    '快艇往返',
    '浮潜装备',
    '海鲜午餐',
    '救生衣',
    '导游'
  ],
  ARRAY[
    '额外饮品',
    '个人消费'
  ],
  '会安游船码头（安邦海滩）'
FROM tours WHERE slug = 'cham-island'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: cham-island  |  language: ru
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'ru',
  'Остров Чам',
  'Кристально чистые воды, коралловые рифы и свежие морепродукты у берегов Хойана.',
  'Остров Чам (Ку Лао Чам) — биосферный заповедник ЮНЕСКО всего в 15 км от берега Хойана. Добраться на скоростном катере через прозрачные воды Южно-Китайского моря, а затем весь день наслаждаться сноркелингом над яркими коралловыми рифами и свежайшими морепродуктами.',
  ARRAY[
    'Биосферный заповедник ЮНЕСКО',
    'Сноркелинг над коралловыми рифами',
    'Переправа на скоростном катере',
    'Обед из свежих морепродуктов на пляже'
  ],
  ARRAY[
    'Трансфер на скоростном катере',
    'Снаряжение для сноркелинга',
    'Обед из морепродуктов',
    'Спасательный жилет',
    'Гид'
  ],
  ARRAY[
    'Дополнительные напитки',
    'Личные расходы'
  ],
  'Причал в Хойане (пляж Ан Банг)'
FROM tours WHERE slug = 'cham-island'
ON CONFLICT (tour_id, language) DO NOTHING;


-- -------------------------------------------------------
-- TOUR: hue-city-tour  |  language: vi
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'vi',
  'Tham Quan Thành Phố Huế',
  'Kinh thành Huế, lăng tẩm hoàng gia và đèo Hải Vân hùng vĩ.',
  'Hành trình ra phía Bắc đến Huế, cố đô nghìn năm của Việt Nam, qua đèo Hải Vân huyền thoại. Khám phá Đại Nội rộng lớn, viếng thăm các lăng tẩm uy nghi của nhà Nguyễn và du thuyền trên sông Hương thơ mộng.',
  ARRAY[
    'Toàn cảnh biển từ đèo Hải Vân',
    'Đại Nội Huế',
    'Lăng tẩm các vua nhà Nguyễn',
    'Chùa Thiên Mụ'
  ],
  ARRAY[
    'Xe đưa đón có máy lạnh',
    'Hướng dẫn viên tiếng Anh',
    'Vé vào cửa',
    'Bữa trưa'
  ],
  ARRAY[
    'Thuyền trên sông Hương (+5 USD)',
    'Chi phí cá nhân'
  ],
  'Đón tại khách sạn ở Hội An / Đà Nẵng'
FROM tours WHERE slug = 'hue-city-tour'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: hue-city-tour  |  language: zh
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'zh',
  '顺化城市游',
  '皇家城堡、王室陵墓与壮观的海云岭。',
  '经由传奇的海云岭北上前往越南古代帝都顺化。游览宏伟的皇城，参观氛围浓郁的阮朝王陵，并在香江上泛舟游览。',
  ARRAY[
    '海云岭海岸全景',
    '顺化皇城',
    '阮朝王室陵墓',
    '天姥寺'
  ],
  ARRAY[
    '空调接送车',
    '英语导游',
    '门票',
    '午餐'
  ],
  ARRAY[
    '香江游船（+5美元）',
    '个人消费'
  ],
  '会安 / 岘港酒店接送'
FROM tours WHERE slug = 'hue-city-tour'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: hue-city-tour  |  language: ru
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'ru',
  'Экскурсия по Хюэ',
  'Императорская цитадель, королевские гробницы и живописный перевал Хай Ван.',
  'Отправьтесь на север в Хюэ — древнюю императорскую столицу Вьетнама — через легендарный перевал Хай Ван. Исследуйте обширную Императорскую цитадель, посетите атмосферные королевские гробницы династии Нгуен и прогуляйтесь по реке Парфюмерной.',
  ARRAY[
    'Прибрежная панорама с перевала Хай Ван',
    'Императорская цитадель Хюэ',
    'Королевские гробницы династии Нгуен',
    'Пагода Тхьен Му'
  ],
  ARRAY[
    'Трансфер на кондиционированном транспорте',
    'Англоязычный гид',
    'Входные билеты',
    'Обед'
  ],
  ARRAY[
    'Прогулка на лодке по реке Хыонг (+5 USD)',
    'Личные расходы'
  ],
  'Трансфер от отеля в Хойане / Дананге'
FROM tours WHERE slug = 'hue-city-tour'
ON CONFLICT (tour_id, language) DO NOTHING;


-- -------------------------------------------------------
-- TOUR: cham-museum-han-market  |  language: vi
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'vi',
  'Bảo Tàng Chăm & Chợ Hàn',
  'Bộ sưu tập điêu khắc Chăm đẳng cấp thế giới và khu chợ sầm uất của Đà Nẵng.',
  'Bắt đầu tại Bảo tàng Điêu khắc Chăm ở Đà Nẵng — nơi lưu giữ bộ sưu tập điêu khắc Chăm đẳng cấp thế giới. Sau đó đến Chợ Hàn, khu chợ sầm uất nhất Đà Nẵng, nơi bạn có thể thưởng thức ẩm thực Việt tươi ngon và ngắm nhìn hàng thủ công địa phương.',
  ARRAY[
    'Bộ sưu tập điêu khắc Chăm đẳng cấp thế giới',
    'Khu chợ có mái che lâu đời nhất Đà Nẵng',
    'Thưởng thức ẩm thực đường phố địa phương',
    'Thuyết minh văn hóa chuyên sâu'
  ],
  ARRAY[
    'Xe đưa đón',
    'Hướng dẫn viên',
    'Vé vào Bảo tàng Chăm'
  ],
  ARRAY[
    'Mua thức ăn',
    'Mua sắm'
  ],
  'Đón tại khách sạn ở Đà Nẵng / Hội An'
FROM tours WHERE slug = 'cham-museum-han-market'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: cham-museum-han-market  |  language: zh
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'zh',
  '占婆博物馆与韩市场',
  '世界顶级占婆雕塑藏品与岘港最热闹的市集。',
  '首先参观岘港占婆博物馆——这里收藏着世界上最精美的占婆雕塑。然后前往岘港最具活力的韩市场，品尝新鲜越南美食，欣赏当地手工艺品。',
  ARRAY[
    '世界级占婆雕塑收藏',
    '岘港最古老的有盖市场',
    '当地街头小吃品鉴',
    '专业文化解说'
  ],
  ARRAY[
    '接送车',
    '导游',
    '占婆博物馆门票'
  ],
  ARRAY[
    '食品购买',
    '购物消费'
  ],
  '岘港 / 会安酒店接送'
FROM tours WHERE slug = 'cham-museum-han-market'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: cham-museum-han-market  |  language: ru
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'ru',
  'Музей Чамов и рынок Хан',
  'Лучшая в мире коллекция скульптур Чамов и оживлённый рынок Дананга.',
  'Начните с Музея Чамов в Дананге — здесь хранится лучшая в мире коллекция скульптур Чамской цивилизации. Затем направляйтесь на рынок Хан — самый оживлённый местный рынок Дананга, где можно попробовать свежую вьетнамскую еду и рассмотреть местные ремёсла.',
  ARRAY[
    'Коллекция скульптур Чамов мирового класса',
    'Старейший крытый рынок Дананга',
    'Дегустация уличной еды',
    'Профессиональные культурные комментарии'
  ],
  ARRAY[
    'Трансфер',
    'Гид',
    'Входной билет в Музей Чамов'
  ],
  ARRAY[
    'Покупка еды',
    'Шопинг'
  ],
  'Трансфер от отеля в Дананге / Хойане'
FROM tours WHERE slug = 'cham-museum-han-market'
ON CONFLICT (tour_id, language) DO NOTHING;


-- -------------------------------------------------------
-- TOUR: basket-boat-tour  |  language: vi
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'vi',
  'Tour Thuyền Thúng',
  'Quay vòng qua những dòng kênh dừa nước bằng chiếc thuyền thúng truyền thống.',
  'Trải nghiệm một trong những hoạt động độc đáo nhất Việt Nam: chuyến đi trên thuyền thúng tre tròn truyền thống qua những dòng kênh dừa nước quyến rũ của làng Cẩm Thanh.',
  ARRAY[
    'Chèo thuyền thúng tre truyền thống',
    'Rừng dừa nước trên mặt nước',
    'Biểu diễn câu cua và cá',
    'Dừa tươi bên bờ sông'
  ],
  ARRAY[
    'Xe đưa đón khứ hồi',
    'Thuyền và áo phao',
    'Hướng dẫn viên địa phương'
  ],
  ARRAY[
    'Tiền tip cho người chèo thuyền (được hoan nghênh)'
  ],
  'Đón tại khách sạn ở Hội An'
FROM tours WHERE slug = 'basket-boat-tour'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: basket-boat-tour  |  language: zh
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'zh',
  '圆篮船游览',
  '乘坐传统圆形竹篮船，穿梭于椰林水道之间。',
  '体验越南最独特的活动之一：乘坐传统圆形竹篮船，穿越金茶村迷人的椰林水道。',
  ARRAY[
    '传统竹篮船体验',
    '椰林水上森林',
    '捕蟹和捕鱼演示',
    '岸边品尝新鲜椰子'
  ],
  ARRAY[
    '往返接送',
    '竹篮船及救生衣',
    '当地导游'
  ],
  ARRAY[
    '船工小费（欢迎给予）'
  ],
  '会安酒店接送'
FROM tours WHERE slug = 'basket-boat-tour'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: basket-boat-tour  |  language: ru
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'ru',
  'Тур на корзиночной лодке',
  'Покружитесь по каналам среди кокосовых пальм в традиционной плетёной лодке.',
  'Попробуйте одно из самых уникальных занятий во Вьетнаме — прогулку на традиционной круглой бамбуковой корзиночной лодке по очаровательным водным каналам деревни Кам Тхань среди кокосовых пальм.',
  ARRAY[
    'Традиционная круглая бамбуковая корзиночная лодка',
    'Лес из кокосовых пальм на воде',
    'Демонстрация ловли крабов и рыбы',
    'Свежий кокос на берегу'
  ],
  ARRAY[
    'Трансфер туда-обратно',
    'Лодка и спасательный жилет',
    'Местный гид'
  ],
  ARRAY[
    'Чаевые гребцу (приветствуются)'
  ],
  'Трансфер от отеля в Хойане'
FROM tours WHERE slug = 'basket-boat-tour'
ON CONFLICT (tour_id, language) DO NOTHING;


-- -------------------------------------------------------
-- TOUR: vespa-tour  |  language: vi
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'vi',
  'Tour Vespa',
  'Ngồi phía sau xe Vespa cổ, khám phá những ngõ hẻm ẩn và điểm ăn đường phố.',
  'Leo lên yên sau chiếc xe Vespa cổ cùng hướng dẫn viên địa phương thông thạo và khám phá phố cổ Hội An, những làng quê xung quanh và những điểm ăn uống bí mật mà hầu hết khách du lịch không bao giờ tìm thấy.',
  ARRAY[
    'Dạo phố cổ Hội An bằng Vespa vintage',
    '4–5 điểm dừng ẩm thực địa phương authentic',
    'Không khí đèn lồng buổi tối',
    'Những ngõ hẻm ít người biết'
  ],
  ARRAY[
    'Xe Vespa và tài xế',
    'Mũ bảo hiểm',
    'Thức ăn tại các điểm dừng',
    'Nước uống'
  ],
  ARRAY[
    'Bữa ăn đầy đủ',
    'Đồ uống ngoài phần nếm thử'
  ],
  'Phố cổ Hội An (điểm hẹn xác nhận khi đặt tour)'
FROM tours WHERE slug = 'vespa-tour'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: vespa-tour  |  language: zh
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'zh',
  '韦士柏摩托车游',
  '乘坐复古韦士柏摩托车，穿越隐秘小巷与街头美食点。',
  '坐上复古韦士柏摩托车的后座，由经验丰富的当地向导兼司机带领，探索会安古镇、周边村庄以及大多数游客从未涉足的隐秘美食地点。',
  ARRAY[
    '复古韦士柏穿越会安古镇',
    '4至5个正宗当地美食停靠点',
    '夜晚灯笼氛围',
    '非主流隐秘小巷'
  ],
  ARRAY[
    '韦士柏摩托车及司机',
    '头盔',
    '各停靠点美食品尝',
    '饮用水'
  ],
  ARRAY[
    '正餐',
    '品尝以外的饮品'
  ],
  '会安古镇（预订后确认集合地点）'
FROM tours WHERE slug = 'vespa-tour'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: vespa-tour  |  language: ru
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'ru',
  'Тур на Веспе',
  'Прокатитесь на ретро-Веспе по скрытым переулкам и остановкам уличной еды.',
  'Садитесь на заднее сиденье винтажного мотороллера Веспа вместе с опытным местным гидом-водителем и исследуйте старый квартал Хойана, окрестные деревни и скрытые гастрономические точки, о которых большинство туристов никогда не узнает.',
  ARRAY[
    'Поездка на ретро-Веспе по старому Хойану',
    '4–5 остановок с аутентичной местной едой',
    'Вечерняя атмосфера фонарей',
    'Укромные переулки вдали от туристических маршрутов'
  ],
  ARRAY[
    'Веспа и водитель',
    'Шлем',
    'Дегустация блюд на остановках',
    'Вода'
  ],
  ARRAY[
    'Полноценные блюда',
    'Напитки сверх дегустационных порций'
  ],
  'Старый город Хойан (точка встречи подтверждается при бронировании)'
FROM tours WHERE slug = 'vespa-tour'
ON CONFLICT (tour_id, language) DO NOTHING;


-- -------------------------------------------------------
-- TOUR: diving-tour  |  language: vi
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'vi',
  'Tour Lặn Biển',
  'Khám phá những rạn san hô rực rỡ ở Biển Đông cùng huấn luyện viên PADI.',
  'Lặn xuống vùng nước trong xanh quanh Cù Lao Chàm. Dù bạn là thợ lặn đã có chứng chỉ hay người mới hoàn toàn, các huấn luyện viên đạt chứng nhận PADI của chúng tôi sẽ hướng dẫn bạn an toàn qua những vườn san hô đầy màu sắc và đời sống biển phong phú.',
  ARRAY[
    'Huấn luyện viên lặn đạt chứng nhận PADI',
    'Hai lần lặn tại hai địa điểm rạn san hô khác nhau',
    'Giới thiệu về đa dạng sinh học biển',
    'Lựa chọn lặn khám phá cho người mới'
  ],
  ARRAY[
    'Tàu cao tốc',
    'Toàn bộ thiết bị lặn',
    'Huấn luyện viên PADI',
    '2 lần lặn',
    'Đồ ăn nhẹ'
  ],
  ARRAY[
    'Phí chứng chỉ lặn (nếu cần)',
    'Thuê máy ảnh dưới nước'
  ],
  'Bến thuyền Hội An'
FROM tours WHERE slug = 'diving-tour'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: diving-tour  |  language: zh
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'zh',
  '潜水游览',
  '与PADI教练一起探索南海生机盎然的珊瑚礁。',
  '潜入占婆岛周围清澈的海水之中。无论您是持证潜水员还是完全的初学者，我们的PADI认证教练都将安全地引导您穿越色彩斑斓的珊瑚园和多样的海洋生物世界。',
  ARRAY[
    'PADI认证潜水教练',
    '在两处不同礁石点进行两次潜水',
    '海洋生物多样性简介',
    '为初学者提供体验潜水选项'
  ],
  ARRAY[
    '快艇',
    '全套潜水装备',
    'PADI教练',
    '2次潜水',
    '点心'
  ],
  ARRAY[
    '潜水证书费用（如需要）',
    '水下相机租借'
  ],
  '会安游船码头'
FROM tours WHERE slug = 'diving-tour'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: diving-tour  |  language: ru
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'ru',
  'Тур с дайвингом',
  'Откройте для себя яркие рифы Южно-Китайского моря с инструкторами PADI.',
  'Погрузитесь в кристально чистые воды вокруг острова Чам. Независимо от того, являетесь ли вы сертифицированным дайвером или полным новичком, наши сертифицированные инструкторы PADI безопасно проведут вас через красочные коралловые сады и разнообразный морской мир.',
  ARRAY[
    'Сертифицированные инструкторы PADI',
    'Два погружения на разных рифовых площадках',
    'Инструктаж по морскому биоразнообразию',
    'Вариант пробного погружения для новичков'
  ],
  ARRAY[
    'Скоростной катер',
    'Всё снаряжение для дайвинга',
    'Инструктор PADI',
    '2 погружения',
    'Лёгкие закуски'
  ],
  ARRAY[
    'Плата за сертификат дайвера (при необходимости)',
    'Аренда подводной камеры'
  ],
  'Причал в Хойане'
FROM tours WHERE slug = 'diving-tour'
ON CONFLICT (tour_id, language) DO NOTHING;


-- -------------------------------------------------------
-- TOUR: hoi-an-bike-tour  |  language: vi
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'vi',
  'Tour Đạp Xe Hội An',
  'Đạp xe qua những cánh đồng lúa và làng ven sông lúc bình minh.',
  'Khám phá vùng nông thôn xung quanh phố cổ Hội An bằng hai bánh. Đạp xe theo những con đường yên tĩnh qua những cánh đồng lúa xanh ngát, vượt qua những cây cầu gỗ và ghé thăm xưởng chạm khắc của người thợ địa phương.',
  ARRAY[
    'Tuyến đường đạp xe qua ruộng lúa và làng quê',
    'Điểm dừng chân tại quán cà phê ven sông',
    'Tham quan xưởng thợ mộc địa phương',
    'Bờ sông Thu Bồn thơ mộng'
  ],
  ARRAY[
    'Xe đạp',
    'Mũ bảo hiểm',
    'Hướng dẫn viên',
    'Cà phê Việt Nam'
  ],
  ARRAY[
    'Chi phí ăn uống cá nhân'
  ],
  'Phố cổ Hội An (xác nhận khi đặt tour)'
FROM tours WHERE slug = 'hoi-an-bike-tour'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: hoi-an-bike-tour  |  language: zh
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'zh',
  '会安骑行游',
  '在日出时分骑行穿越稻田和河畔村庄。',
  '骑上自行车，探索会安古镇周边的乡村风光。沿安静的小路穿越翠绿的稻田，跨越木桥，拜访当地木匠工坊。',
  ARRAY[
    '稻田与村庄骑行路线',
    '河畔咖啡馆休息站',
    '当地木匠工坊参观',
    '秀丽的秋盆河畔风光'
  ],
  ARRAY[
    '自行车',
    '头盔',
    '导游',
    '越南咖啡'
  ],
  ARRAY[
    '个人餐饮消费'
  ],
  '会安古镇（预订后确认集合地点）'
FROM tours WHERE slug = 'hoi-an-bike-tour'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: hoi-an-bike-tour  |  language: ru
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'ru',
  'Велотур по Хойану',
  'Покатайтесь на велосипеде по рисовым полям и прибрежным деревням на рассвете.',
  'Исследуйте сельскую местность вокруг старого города Хойан на двух колёсах. Педалируйте по тихим тропинкам через изумрудные рисовые поля, переезжайте по деревянным мостам и заезжайте в мастерскую местного плотника.',
  ARRAY[
    'Маршрут по рисовым полям и деревням',
    'Остановка в кафе на берегу реки',
    'Посещение мастерской местного плотника',
    'Живописный берег реки Тху Бон'
  ],
  ARRAY[
    'Велосипед',
    'Шлем',
    'Гид',
    'Вьетнамский кофе'
  ],
  ARRAY[
    'Личные расходы на еду и напитки'
  ],
  'Старый город Хойан (подтверждается при бронировании)'
FROM tours WHERE slug = 'hoi-an-bike-tour'
ON CONFLICT (tour_id, language) DO NOTHING;


-- -------------------------------------------------------
-- TOUR: easy-rider-tour  |  language: vi
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'vi',
  'Tour Easy Rider',
  'Phóng xe máy khám phá miền quê cùng hướng dẫn viên địa phương nhiệt huyết.',
  'Ngồi phía sau xe máy cùng hướng dẫn viên địa phương nhiệt tình, chạy qua những làng nông nghiệp phía tây thành phố, lên những ngọn đồi để ngắm nương tiêu và rẫy sắn, qua những con trâu đang cày ruộng.',
  ARRAY[
    'Chuyến đi xe máy off-road vào vùng nông thôn',
    'Thăm các làng nông nghiệp địa phương',
    'Bữa trưa nấu tại nhà dân trong làng',
    'Thuyết minh chân thực từ hướng dẫn viên địa phương'
  ],
  ARRAY[
    'Xe máy và hướng dẫn viên kiêm tài xế',
    'Mũ bảo hiểm',
    'Bữa trưa tại nhà dân địa phương'
  ],
  ARRAY[
    'Đồ uống',
    'Tiền tip'
  ],
  'Đón tại khách sạn ở Hội An'
FROM tours WHERE slug = 'easy-rider-tour'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: easy-rider-tour  |  language: zh
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'zh',
  '易骑摩托游',
  '与当地向导一起骑上摩托车，驰骋于开阔的乡间公路。',
  '坐上热情当地向导的摩托车后座，穿越城西农业村庄，驶入丘陵地带欣赏胡椒农场和木薯地，途经在稻田耕作的水牛。',
  ARRAY[
    '越野摩托车乡村骑行',
    '参观当地农业村庄',
    '在当地农家享用家常午餐',
    '真实的当地向导解说'
  ],
  ARRAY[
    '摩托车及司机兼导游',
    '头盔',
    '当地农家午餐'
  ],
  ARRAY[
    '饮品',
    '小费'
  ],
  '会安酒店接送'
FROM tours WHERE slug = 'easy-rider-tour'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: easy-rider-tour  |  language: ru
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'ru',
  'Тур Easy Rider',
  'Выезжайте на открытую дорогу с местным гидом на мотоцикле.',
  'Садитесь на заднее сиденье мотоцикла вашего увлечённого местного гида-водителя и проезжайте через фермерские деревни к западу от города, поднимайтесь в холмы к плантациям перца и полям маниоки, мимо буйволов, пашущих рисовые поля.',
  ARRAY[
    'Внедорожная мотопрогулка по сельской местности',
    'Посещение местных фермерских деревень',
    'Домашний обед в деревне',
    'Аутентичный комментарий от местного гида'
  ],
  ARRAY[
    'Мотоцикл и гид-водитель',
    'Шлем',
    'Обед в местном доме'
  ],
  ARRAY[
    'Напитки',
    'Чаевые'
  ],
  'Трансфер от отеля в Хойане'
FROM tours WHERE slug = 'easy-rider-tour'
ON CONFLICT (tour_id, language) DO NOTHING;


-- -------------------------------------------------------
-- TOUR: thanh-ha-pottery-village  |  language: vi
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'vi',
  'Làng Gốm Thanh Hà',
  'Truyền thống gốm 500 năm — hãy thử tay nghề với bàn xoay!',
  'Chỉ cách Phố cổ Hội An 3km, Thanh Hà là ngôi làng với 500 năm truyền thống làm gốm không ngừng nghỉ. Ngắm nhìn các nghệ nhân lành nghề và thử tự tạo ra một chiếc bình dưới sự hướng dẫn chuyên nghiệp của họ.',
  ARRAY[
    'Truyền thống gốm 500 năm',
    'Trải nghiệm thực hành bàn xoay gốm',
    'Mô hình thu nhỏ Phố cổ Hội An',
    'Mang sản phẩm của bạn về nhà'
  ],
  ARRAY[
    'Xe đạp hoặc xe đưa đón',
    'Vé vào cửa',
    'Bài học nặn đất sét',
    'Hướng dẫn viên'
  ],
  ARRAY[
    'Mua sản phẩm gốm',
    'Phí nung / vận chuyển sản phẩm của bạn'
  ],
  'Đón tại khách sạn ở Hội An'
FROM tours WHERE slug = 'thanh-ha-pottery-village'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: thanh-ha-pottery-village  |  language: zh
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'zh',
  '清河陶瓷村',
  '500年陶瓷传统——亲手体验拉坯制陶！',
  '距会安古镇仅3公里的清河村拥有500年不间断的制陶传统。观看陶艺大师展示技艺，并在他们的专业指导下亲手尝试制作一件陶器。',
  ARRAY[
    '500年陶瓷传统',
    '亲手拉坯体验',
    '会安古镇微缩模型',
    '带走您亲手制作的作品'
  ],
  ARRAY[
    '自行车或接送车',
    '门票',
    '陶土课程',
    '导游'
  ],
  ARRAY[
    '陶瓷购买',
    '作品烧制/运输费用'
  ],
  '会安酒店接送'
FROM tours WHERE slug = 'thanh-ha-pottery-village'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: thanh-ha-pottery-village  |  language: ru
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'ru',
  'Гончарная деревня Тхань Ха',
  '500-летняя гончарная традиция — попробуйте свои силы за гончарным кругом!',
  'Всего в 3 км от Старого города Хойана, Тхань Ха — деревня с 500-летней непрерывной традицией гончарного дела. Наблюдайте за мастерами и попробуйте сами создать горшок под их профессиональным руководством.',
  ARRAY[
    '500-летняя гончарная традиция',
    'Практика на гончарном круге',
    'Миниатюрная копия Древнего города',
    'Заберите своё изделие домой'
  ],
  ARRAY[
    'Велосипед или трансфер',
    'Входной билет',
    'Урок работы с глиной',
    'Гид'
  ],
  ARRAY[
    'Покупка керамики',
    'Обжиг / доставка вашего изделия'
  ],
  'Трансфер от отеля в Хойане'
FROM tours WHERE slug = 'thanh-ha-pottery-village'
ON CONFLICT (tour_id, language) DO NOTHING;


-- -------------------------------------------------------
-- TOUR: tra-que-herb-village  |  language: vi
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'vi',
  'Làng Rau Trà Quế',
  'Học canh tác truyền thống và nấu ăn với rau thơm tươi hái tại chỗ.',
  'Trà Quế là một ngôi làng nông nghiệp hữu cơ nhỏ nằm ngay ngoại ô Hội An. Cùng người nông dân trải nghiệm một buổi sáng, học cày bừa và gieo hạt theo phương pháp truyền thống, sau đó tự tay hái rau thơm tươi để tham gia lớp học nấu ăn Việt Nam thực hành.',
  ARRAY[
    'Nông nghiệp rau thơm và rau xanh hữu cơ',
    'Biểu diễn cày bừa và tưới nước truyền thống',
    'Lớp học nấu ăn Việt Nam thực hành',
    'Thưởng thức bữa ăn bạn tự nấu'
  ],
  ARRAY[
    'Xe đạp hoặc xe đưa đón',
    'Hoạt động nông nghiệp',
    'Lớp học nấu ăn',
    'Bữa trưa do bạn nấu',
    'Hướng dẫn viên'
  ],
  ARRAY[
    'Đồ uống ngoài nước lọc'
  ],
  'Đón tại khách sạn ở Hội An'
FROM tours WHERE slug = 'tra-que-herb-village'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: tra-que-herb-village  |  language: zh
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'zh',
  '茶橘香草村',
  '学习传统农耕，用现采香草烹饪越南美食。',
  '茶橘是紧邻会安的一个小型有机农业村。与农民一起度过一个上午，用传统方式学习犁地和播种，然后亲手采摘新鲜香草，参加实操越南烹饪课。',
  ARRAY[
    '有机香草和蔬菜种植',
    '传统犁地与浇水演示',
    '越南烹饪实操课',
    '品尝亲手烹制的美食'
  ],
  ARRAY[
    '自行车或接送车',
    '农耕活动',
    '烹饪课',
    '亲手烹制的午餐',
    '导游'
  ],
  ARRAY[
    '饮用水以外的饮品'
  ],
  '会安酒店接送'
FROM tours WHERE slug = 'tra-que-herb-village'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: tra-que-herb-village  |  language: ru
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'ru',
  'Деревня пряных трав Тра Куэ',
  'Освойте традиционное земледелие и готовьте со свежесорванными травами.',
  'Тра Куэ — небольшая органическая фермерская деревня сразу за пределами Хойана. Присоединитесь к фермерам на утро, научитесь пахать и сеять традиционными методами, затем сами соберите свежие травы для практического урока вьетнамской кулинарии.',
  ARRAY[
    'Органическое выращивание трав и овощей',
    'Демонстрация традиционной вспашки и полива',
    'Практический урок вьетнамской кулинарии',
    'Съешьте блюдо, которое сами приготовили'
  ],
  ARRAY[
    'Велосипед или трансфер',
    'Сельскохозяйственные работы',
    'Кулинарный урок',
    'Обед из ваших блюд',
    'Гид'
  ],
  ARRAY[
    'Напитки, кроме воды'
  ],
  'Трансфер от отеля в Хойане'
FROM tours WHERE slug = 'tra-que-herb-village'
ON CONFLICT (tour_id, language) DO NOTHING;


-- -------------------------------------------------------
-- TOUR: marble-mountain-danang-city  |  language: vi
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'vi',
  'Ngũ Hành Sơn & Thành Phố Đà Nẵng',
  'Hang động linh thiêng, tượng Phật và cầu Rồng nổi tiếng của Đà Nẵng.',
  'Chuyến tham quan nửa ngày hoàn hảo kết hợp những điểm nổi bật thiên nhiên và đô thị của Đà Nẵng. Bắt đầu tại Ngũ Hành Sơn, sau đó lái xe vào trung tâm Đà Nẵng để ngắm cầu Rồng nổi tiếng, tượng Phật Bà khổng lồ ở bán đảo Sơn Trà và dạo bộ dọc bờ sông Hàn.',
  ARRAY[
    'Hang động và chùa chiền Ngũ Hành Sơn',
    'Tượng Phật Bà khổng lồ ở Sơn Trà',
    'Cầu Rồng & Sông Hàn',
    'Tầm nhìn ra bãi biển Non Nước'
  ],
  ARRAY[
    'Xe đưa đón có máy lạnh',
    'Hướng dẫn viên',
    'Vé vào Ngũ Hành Sơn'
  ],
  ARRAY[
    'Vé thang máy tại Ngũ Hành Sơn',
    'Bữa trưa'
  ],
  'Đón tại khách sạn ở Hội An / Đà Nẵng'
FROM tours WHERE slug = 'marble-mountain-danang-city'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: marble-mountain-danang-city  |  language: zh
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'zh',
  '五行山与岘港城市游',
  '神圣洞穴、佛像与岘港著名的龙桥。',
  '完美的半日游，融合了岘港的自然与城市亮点。从五行山开始，随后驱车进入岘港市区，欣赏著名的龙桥、山茶半岛标志性的海山大佛，以及沿韩江滨江大道漫步。',
  ARRAY[
    '五行山洞穴与寺庙',
    '山茶半岛巨型海山大佛',
    '龙桥与韩江',
    '非浓海滩全景'
  ],
  ARRAY[
    '空调接送车',
    '导游',
    '五行山门票'
  ],
  ARRAY[
    '五行山电梯票',
    '午餐'
  ],
  '会安 / 岘港酒店接送'
FROM tours WHERE slug = 'marble-mountain-danang-city'
ON CONFLICT (tour_id, language) DO NOTHING;

-- -------------------------------------------------------
-- TOUR: marble-mountain-danang-city  |  language: ru
-- -------------------------------------------------------
INSERT INTO tour_translations (tour_id, language, name, short_description, description, highlights, included, excluded, meeting_point)
SELECT id, 'ru',
  'Мраморные горы и Дананг',
  'Священные пещеры, статуи Будды и знаменитый Драконий мост Дананга.',
  'Идеальная полудневная экскурсия, сочетающая природные и городские достопримечательности Дананга. Начните с Мраморных гор, затем отправляйтесь в город — к знаменитому Драконьему мосту, к культовой Белой даме Будды на полуострове Шон Тра и на прогулку вдоль набережной реки Хан.',
  ARRAY[
    'Пещеры и пагоды Мраморных гор',
    'Гигантская Белая дама Будды на Шон Тра',
    'Драконий мост и река Хан',
    'Вид на пляж Нон Нуок'
  ],
  ARRAY[
    'Трансфер на кондиционированном транспорте',
    'Гид',
    'Входной билет на Мраморные горы'
  ],
  ARRAY[
    'Билет на лифт на Мраморных горах',
    'Обед'
  ],
  'Трансфер от отеля в Хойане / Дананге'
FROM tours WHERE slug = 'marble-mountain-danang-city'
ON CONFLICT (tour_id, language) DO NOTHING;
