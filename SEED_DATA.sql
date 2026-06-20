-- ============================================================
-- TILT.SHOP — Données de démarrage (seed)
-- À exécuter APRÈS avoir créé les tables (voir GUIDE_DEPLOIEMENT.md, étape migration)
-- Compatible MySQL 8+ / TiDB
-- ============================================================

-- ---------- CATÉGORIES ----------
INSERT INTO categories (name, slug, description, icon) VALUES
('Tech & Connectés', 'tech-connectes', 'Objets connectés et gadgets intelligents', 'Cpu'),
('Maison & Confort', 'maison-confort', 'Innovations pour la maison et le bien-être', 'Home'),
('Audio & Son', 'audio-son', 'Écouteurs, enceintes et accessoires audio', 'Headphones'),
('Énergie & Mobilité', 'energie-mobilite', 'Batteries, chargeurs et accessoires nomades', 'BatteryCharging');

-- ---------- PRODUITS ----------
-- NOTE : les imageUrl pointent vers le CDN Manus. Si vous hébergez ailleurs,
-- remplacez ces URL par vos propres images (voir GUIDE_DEPLOIEMENT.md).
INSERT INTO products (name, slug, description, shortDescription, price, originalPrice, categoryId, imageUrl, stock, badge, isActive, isFeatured, tags, aiScore) VALUES
('Montre Connectée TILT Pulse', 'montre-connectee-tilt-pulse', 'La montre intelligente qui suit votre santé en temps réel : fréquence cardiaque, sommeil, oxygène sanguin et plus de 100 modes sportifs. Écran AMOLED ultra-lumineux, autonomie 14 jours, étanche 5ATM. Compatible iOS et Android.', 'Suivi santé complet, autonomie 14 jours, écran AMOLED', '89.90', '129.90', 1, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663031092362/L8gbHBA7FiKMyw9kvXShbg/prod-smartwatch-UoGGvCQip4pu4ekJ4vNWRL.webp', 120, 'bestseller', 1, 1, '["santé","sport","connecté"]', '94.50'),
('Écouteurs Sans Fil TILT Air', 'ecouteurs-sans-fil-tilt-air', 'Une immersion sonore totale grâce à la réduction de bruit active adaptative. Son haute fidélité, micros à formation de faisceau pour des appels cristallins. Boîtier de charge offrant 32h d''autonomie totale. Charge sans fil et résistance à l''eau IPX5.', 'Réduction de bruit active, 32h autonomie, son HiFi', '69.90', '99.90', 3, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663031092362/L8gbHBA7FiKMyw9kvXShbg/prod-earbuds-D3eb8h8SyeKDzYpsniQfF9.webp', 200, 'bestseller', 1, 1, '["audio","sans-fil","ANC"]', '92.00'),
('Purificateur d''Air Intelligent TILT Pure', 'purificateur-air-tilt-pure', 'Respirez un air sain en permanence. Filtre HEPA H13 capturant 99,97% des particules, capteur de qualité d''air en temps réel, contrôle via application et mode automatique silencieux. Idéal pour les chambres et bureaux jusqu''à 40m².', 'Filtre HEPA H13, capteur temps réel, ultra-silencieux', '149.90', '199.90', 2, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663031092362/L8gbHBA7FiKMyw9kvXShbg/prod-purifier-BtZxkbV7TdtG4ujFUEhSL4.webp', 60, 'innovation', 1, 1, '["maison","santé","air"]', '96.00'),
('Lampe de Bureau LED TILT Focus', 'lampe-bureau-led-tilt-focus', 'La lampe qui s''adapte à votre rythme. Température de couleur ajustable, capteur de luminosité automatique, mode protection des yeux et bras articulé en aluminium. Port USB de charge intégré et minuteur intelligent.', 'Température ajustable, protection des yeux, port USB', '54.90', NULL, 2, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663031092362/L8gbHBA7FiKMyw9kvXShbg/prod-lamp-7igCzZni4TSBspDYKotJNw.webp', 90, 'tendance', 1, 1, '["maison","bureau","LED"]', '88.50'),
('Gourde Connectée TILT Hydro', 'gourde-connectee-tilt-hydro', 'Ne soyez plus jamais déshydraté. Affichage de température sur le bouchon, rappels lumineux d''hydratation, isolation 24h froid / 12h chaud. Acier inoxydable sans BPA, design élégant. Suivi de consommation via application.', 'Affichage température, rappels hydratation, isolation 24h', '34.90', '44.90', 2, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663031092362/L8gbHBA7FiKMyw9kvXShbg/prod-bottle-oEwfPeuknRQBZh4BbsSWW2.webp', 150, 'nouveau', 1, 1, '["maison","santé","hydratation"]', '85.00'),
('Batterie Externe TILT Power 20K', 'batterie-externe-tilt-power-20k', 'L''énergie nomade qui ne vous lâche jamais. 20 000 mAh, charge rapide 65W, recharge un ordinateur portable. Affichage digital du pourcentage, double USB-C et USB-A, charge 3 appareils simultanément.', 'Charge rapide 65W, écran digital, 3 ports', '49.90', '59.90', 4, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663031092362/L8gbHBA7FiKMyw9kvXShbg/prod-powerbank-b9PKbb3pCWNhokE9c6gxuP.webp', 110, 'bestseller', 1, 1, '["mobilité","énergie","charge"]', '90.00'),
('Vidéoprojecteur Portable TILT Cinema', 'videoprojecteur-portable-tilt-cinema', 'Transformez n''importe quel mur en cinéma. Résolution Full HD, mise au point automatique, correction trapézoïdale, Android TV intégré. Compact et léger, parfait pour la maison ou en déplacement. Haut-parleurs intégrés.', 'Full HD, mise au point auto, Android TV intégré', '199.90', '279.90', 1, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663031092362/L8gbHBA7FiKMyw9kvXShbg/prod-projector-LzZpP8sQ7rwduT9KeynKfR.webp', 40, 'innovation', 1, 1, '["tech","cinéma","portable"]', '93.50'),
('Robot Aspirateur TILT Clean', 'robot-aspirateur-tilt-clean', 'Votre maison toujours propre, sans effort. Navigation laser LiDAR, cartographie intelligente multi-étages, aspiration 4000Pa et fonction lavage. Contrôle vocal et application, vidage automatique. Évite les obstacles avec précision.', 'Navigation LiDAR, 4000Pa, lavage et aspiration', '299.90', '399.90', 2, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663031092362/L8gbHBA7FiKMyw9kvXShbg/prod-vacuum-5Bjv23XowtFiWc8fpnngyi.webp', 35, 'innovation', 1, 1, '["maison","robot","nettoyage"]', '97.00'),
('Masseur Cervical Chauffant TILT Relax', 'masseur-cervical-tilt-relax', 'Soulagez les tensions du quotidien. Massage par pétrissage shiatsu, fonction chauffante, 3 niveaux d''intensité. Design ergonomique sans fil, batterie rechargeable. Parfait après une longue journée de travail.', 'Massage shiatsu chauffant, sans fil, 3 intensités', '79.90', '109.90', 2, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663031092362/L8gbHBA7FiKMyw9kvXShbg/prod-massage-aFh9v9DFndUvAhaGTpSwk7.webp', 70, 'tendance', 1, 0, '["bien-être","massage","détente"]', '89.00'),
('Clavier Mécanique Sans Fil TILT Type', 'clavier-mecanique-tilt-type', 'Le clavier qui sublime votre productivité. Switches mécaniques tactiles, rétroéclairage personnalisable, connexion multi-appareils Bluetooth et molette de contrôle. Châssis aluminium premium, autonomie longue durée.', 'Switches mécaniques, multi-appareils, molette de contrôle', '99.90', NULL, 1, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663031092362/L8gbHBA7FiKMyw9kvXShbg/prod-keyboard-9ikFQrkoLTFDwxgAG6iM3f.webp', 80, 'nouveau', 1, 0, '["tech","bureau","clavier"]', '87.50'),
('Enceinte Connectée TILT Sound', 'enceinte-connectee-tilt-sound', 'Un son riche qui remplit la pièce. Assistant vocal intégré, son à 360°, basses profondes et connexion multiroom. Contrôle tactile élégant avec finition dorée. Pilotez votre maison connectée à la voix.', 'Son 360°, assistant vocal, multiroom', '89.90', '119.90', 3, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663031092362/L8gbHBA7FiKMyw9kvXShbg/prod-speaker-joYVVzV2XY44vmnykzFXzK.webp', 95, 'tendance', 1, 0, '["audio","maison","connecté"]', '86.00'),
('Traceur Bluetooth TILT Find', 'traceur-bluetooth-tilt-find', 'Ne perdez plus jamais vos objets. Localisation Bluetooth précise, alarme sonore, réseau communautaire de recherche et batterie remplaçable d''un an. Attachez-le à vos clés, sac ou portefeuille.', 'Localisation précise, alarme, batterie 1 an', '24.90', '29.90', 4, 'https://d2xsxph8kpxj0f.cloudfront.net/310419663031092362/L8gbHBA7FiKMyw9kvXShbg/prod-tracker-n9XfPsAX5FybujJA5tUWLg.webp', 250, 'nouveau', 1, 0, '["mobilité","accessoire","localisation"]', '83.00');

-- ---------- CAMPAGNES PUBLICITAIRES IA ----------
INSERT INTO ai_campaigns (name, type, status, budget, spent, impressions, clicks, conversions, ctr, roi, targetAudience, aiGenerated, aiConfidence, startDate, endDate) VALUES
('Lancement Robot Aspirateur TILT Clean', 'social', 'active', 1500.00, 842.50, 285000, 8550, 312, '3.00', '215.40', '["maison","tech","25-45 ans"]', 1, '92.50', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY)),
('Retargeting Montre Connectée Pulse', 'retargeting', 'active', 800.00, 410.20, 95000, 4275, 198, '4.50', '268.00', '["sport","santé","abandons panier"]', 1, '88.00', NOW(), DATE_ADD(NOW(), INTERVAL 21 DAY)),
('Display Innovations Tech Q3', 'display', 'active', 2000.00, 1120.00, 520000, 10400, 245, '2.00', '142.30', '["early-adopters","gadgets"]', 1, '85.50', NOW(), DATE_ADD(NOW(), INTERVAL 45 DAY)),
('Campagne Email Purificateur Pure', 'email', 'paused', 500.00, 215.00, 42000, 2940, 156, '7.00', '320.00', '["maison","santé","newsletter"]', 1, '90.00', NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY)),
('Search Écouteurs TILT Air', 'search', 'active', 1200.00, 680.40, 156000, 6240, 289, '4.00', '198.70', '["audio","intentions achat"]', 1, '91.20', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY)),
('Social Vidéoprojecteur Cinema', 'social', 'pending_approval', 1000.00, 0.00, 0, 0, 0, '0.00', '0.00', '["cinéphiles","home-cinema","25-50 ans"]', 1, '87.30', NULL, NULL),
('Retargeting Batterie Power 20K', 'retargeting', 'draft', 600.00, 0.00, 0, 0, 0, '0.00', '0.00', '["mobilité","voyageurs"]', 1, '83.00', NULL, NULL);

-- ---------- FILE DE VALIDATION HUMAINE ----------
INSERT INTO ai_validation_queue (type, title, description, data, aiConfidence, priority, status) VALUES
('pricing', 'Baisse de prix suggérée : Montre Connectée TILT Pulse', 'L''IA recommande de baisser le prix de 89.90€ à 84.90€ pour stimuler la demande face à une baisse de trafic de 12% sur la fiche produit.', '{"productId":1,"oldPrice":89.90,"newPrice":84.90}', '88.50', 'high', 'pending'),
('campaign', 'Nouvelle campagne IA : Social Vidéoprojecteur Cinema', 'L''IA propose une campagne social media de 1000€ ciblant les cinéphiles. ROI estimé : +160%. Validation requise avant lancement.', '{"campaignId":6,"budget":1000}', '87.30', 'medium', 'pending'),
('product', 'Ajout suggéré : Casque VR Nouvelle Génération', 'Tendance détectée : +340% de recherches sur les casques VR ce mois-ci. L''IA suggère d''ajouter ce produit au catalogue.', '{"category":"tech","trendScore":94}', '82.00', 'medium', 'pending'),
('pricing', 'Hausse de prix suggérée : Robot Aspirateur TILT Clean', 'Forte demande détectée (+28% ventes). L''IA recommande d''ajuster le prix de 299.90€ à 314.90€ tout en restant compétitif.', '{"productId":8,"oldPrice":299.90,"newPrice":314.90}', '91.00', 'high', 'pending'),
('content', 'Optimisation SEO : Description Purificateur Pure', 'L''IA propose une réécriture de la description pour améliorer le référencement (mots-clés : air pur, HEPA, santé respiratoire).', '{"productId":3}', '79.50', 'low', 'pending'),
('campaign', 'Pause recommandée : Display Innovations Tech Q3', 'CTR en baisse (2.0%, sous le seuil cible de 2.5%). L''IA recommande une pause pour réoptimisation du ciblage.', '{"campaignId":3}', '85.00', 'critical', 'pending');

-- ---------- HISTORIQUE PRICING DYNAMIQUE IA ----------
INSERT INTO ai_pricing_history (productId, oldPrice, newPrice, reason, aiConfidence, demandFactor, competitorFactor, status) VALUES
(2, '74.90', '69.90', 'Alignement concurrentiel : prix moyen du marché détecté à 72€. Baisse pour rester compétitif.', '90.00', '1.05', '0.93', 'applied'),
(6, '54.90', '49.90', 'Promotion dynamique : stock élevé + demande modérée. Baisse temporaire pour accélérer rotation.', '86.50', '0.88', '0.95', 'applied'),
(8, '349.90', '299.90', 'Lancement : prix d''introduction agressif pour gagner des parts de marché sur segment premium.', '93.00', '1.20', '0.85', 'applied'),
(1, '94.90', '89.90', 'Optimisation conversion : élasticité prix détectée, baisse pour maximiser le volume de ventes.', '88.00', '1.10', '0.92', 'applied'),
(7, '249.90', '199.90', 'Repositionnement : analyse concurrentielle révèle une opportunité de prix plus attractif.', '84.50', '1.15', '0.80', 'applied');

-- ---------- MÉTRIQUES IA (7 derniers jours) ----------
INSERT INTO ai_metrics (date, totalRevenue, totalOrders, totalVisitors, conversionRate, aiDecisions, humanDecisions, aiAccuracy, avgOrderValue) VALUES
(DATE_SUB(NOW(), INTERVAL 6 DAY), '3240.50', 28, 1850, '1.51', 142, 16, '93.20', '115.73'),
(DATE_SUB(NOW(), INTERVAL 5 DAY), '4180.20', 35, 2100, '1.67', 168, 18, '94.10', '119.43'),
(DATE_SUB(NOW(), INTERVAL 4 DAY), '3890.00', 31, 1980, '1.57', 155, 17, '92.80', '125.48'),
(DATE_SUB(NOW(), INTERVAL 3 DAY), '5120.80', 42, 2450, '1.71', 198, 21, '94.50', '121.92'),
(DATE_SUB(NOW(), INTERVAL 2 DAY), '4760.30', 38, 2280, '1.67', 182, 20, '93.90', '125.27'),
(DATE_SUB(NOW(), INTERVAL 1 DAY), '5890.60', 47, 2680, '1.75', 215, 23, '95.10', '125.33'),
(NOW(), '6210.40', 51, 2890, '1.76', 232, 25, '94.80', '121.77');
