-- Urjaa Database Seeds: 001_seeds.sql

-- Symptoms
INSERT INTO symptoms (id, name, category, icon) VALUES
('11111111-0000-0000-0000-000000000001', 'Cramps', 'Physical', 'Flame'),
('11111111-0000-0000-0000-000000000002', 'Bloating', 'Digestive', 'Wind'),
('11111111-0000-0000-0000-000000000003', 'Fatigue', 'Energy', 'BatteryLow'),
('11111111-0000-0000-0000-000000000004', 'Headache', 'Physical', 'Brain'),
('11111111-0000-0000-0000-000000000005', 'Mood Swings', 'Emotional', 'SmilePlus'),
('11111111-0000-0000-0000-000000000006', 'Lower Back Pain', 'Physical', 'Activity'),
('11111111-0000-0000-0000-000000000007', 'Food Cravings', 'Digestive', 'Apple'),
('11111111-0000-0000-0000-000000000008', 'Breast Tenderness', 'Physical', 'HeartPulse'),
('11111111-0000-0000-0000-000000000009', 'Insomnia / Restlessness', 'Sleep', 'Moon'),
('11111111-0000-0000-0000-000000000010', 'Acne Breakout', 'Skin', 'Sparkles')
ON CONFLICT (name) DO NOTHING;

-- Exercises (50+ exercises covering all muscle groups and categories)
INSERT INTO exercises (id, name, category, muscle_groups, difficulty, equipment, type, default_reps, default_duration_seconds, rest_seconds, instructions, common_mistakes, quiet_friendly, low_impact, animation_type) VALUES
-- PUSH / UPPER BODY PROGRESSION CHAIN
('22222222-0000-0000-0000-000000000001', 'Wall Push-ups', 'Upper body', ARRAY['Chest', 'Shoulders', 'Triceps'], 'Beginner', 'Wall', 'reps', 10, 30, 20, ARRAY['Stand arm-length from wall', 'Place palms at shoulder height', 'Lower chest gently toward wall', 'Push back with control'], ARRAY['Flaring elbows out too wide', 'Arching lower back'], true, true, 'push_pattern'),
('22222222-0000-0000-0000-000000000002', 'Incline Push-ups', 'Upper body', ARRAY['Chest', 'Shoulders', 'Triceps'], 'Beginner', 'Chair or Table', 'reps', 10, 30, 20, ARRAY['Hands on elevated sturdy surface', 'Body in straight line', 'Lower chest to edge', 'Press up firmly'], ARRAY['Sagging hips', 'Looking up and straining neck'], true, true, 'push_pattern'),
('22222222-0000-0000-0000-000000000003', 'Knee Push-ups', 'Upper body', ARRAY['Chest', 'Shoulders', 'Triceps', 'Core'], 'Beginner', 'Mat', 'reps', 10, 30, 20, ARRAY['Knees on mat, crossed or flat', 'Hands shoulder-width apart', 'Lower chest to floor', 'Push through palms'], ARRAY['Hips back in tabletop position', 'Letting belly drop'], true, true, 'push_pattern'),
('22222222-0000-0000-0000-000000000004', 'Standard Push-ups', 'Upper body', ARRAY['Chest', 'Shoulders', 'Triceps', 'Core'], 'Intermediate', 'None (Bodyweight)', 'reps', 10, 30, 25, ARRAY['High plank position', 'Lower chest to 2 inches off floor', 'Press smoothly to top lockout'], ARRAY['Piking hips upward', 'Dropping head'], true, true, 'push_pattern'),
('22222222-0000-0000-0000-000000000005', 'Diamond Push-ups', 'Upper body', ARRAY['Triceps', 'Chest', 'Shoulders'], 'Advanced', 'None (Bodyweight)', 'reps', 8, 30, 30, ARRAY['Thumbs and index fingers touching in diamond shape under chest', 'Lower body slowly', 'Press through triceps'], ARRAY['Flaring elbows excessively'], true, true, 'push_pattern'),

-- SQUAT / LOWER BODY PROGRESSION CHAIN
('22222222-0000-0000-0000-000000000006', 'Chair Squats (Assisted)', 'Lower body', ARRAY['Quads', 'Glutes'], 'Beginner', 'Chair', 'reps', 10, 30, 20, ARRAY['Stand in front of chair', 'Hips back and touch chair lightly', 'Stand up squeezing glutes'], ARRAY['Collapsing heavily onto chair', 'Knees caving inwards'], true, true, 'squat_pattern'),
('22222222-0000-0000-0000-000000000007', 'Bodyweight Squats', 'Lower body', ARRAY['Quads', 'Glutes', 'Hamstrings'], 'Beginner', 'None (Bodyweight)', 'reps', 12, 30, 20, ARRAY['Feet shoulder-width apart', 'Sit hips back and down to parallel', 'Drive through whole foot to stand'], ARRAY['Heels lifting off ground', 'Rounding spine'], true, true, 'squat_pattern'),
('22222222-0000-0000-0000-000000000008', 'Sumo Squats', 'Lower body', ARRAY['Glutes', 'Quads', 'Hip mobility'], 'Beginner', 'None (Bodyweight)', 'reps', 12, 30, 20, ARRAY['Wide stance with toes pointed outward 45 deg', 'Keep torso upright', 'Descend deep and squeeze glutes on ascent'], ARRAY['Leaning too far forward'], true, true, 'squat_pattern'),
('22222222-0000-0000-0000-000000000009', 'Tempo Squats (3s down)', 'Lower body', ARRAY['Quads', 'Glutes', 'Hamstrings'], 'Intermediate', 'None (Bodyweight)', 'reps', 10, 40, 25, ARRAY['Lower down for 3 slow seconds', 'Pause 1 second at bottom', 'Explode smoothly back up'], ARRAY['Rushing the descent'], true, true, 'squat_pattern'),
('22222222-0000-0000-0000-000000000010', 'Jump Squats', 'Lower body', ARRAY['Quads', 'Glutes', 'Calves'], 'Advanced', 'None (Bodyweight)', 'reps', 10, 30, 30, ARRAY['Squat down to parallel', 'Explosively jump straight up', 'Land softly through toe-to-heel into next squat'], ARRAY['Heavy landing with stiff knees'], false, false, 'jumping_pattern'),

-- LUNGES & LOWER BODY MOBILITY
('22222222-0000-0000-0000-000000000011', 'Supported Static Lunges', 'Lower body', ARRAY['Quads', 'Glutes', 'Hamstrings'], 'Beginner', 'Wall or Chair', 'reps', 8, 30, 20, ARRAY['Hold chair for balance', 'Step one leg back', 'Lower back knee toward floor', 'Push through front heel'], ARRAY['Front knee shooting past toes'], true, true, 'lunge_pattern'),
('22222222-0000-0000-0000-000000000012', 'Reverse Lunges', 'Lower body', ARRAY['Glutes', 'Quads', 'Hamstrings'], 'Beginner', 'None (Bodyweight)', 'reps', 10, 30, 20, ARRAY['Step back with right leg', 'Lower both knees to 90 degrees', 'Return to standing and alternate'], ARRAY['Slamming back knee on floor'], true, true, 'lunge_pattern'),
('22222222-0000-0000-0000-000000000013', 'Walking Lunges', 'Lower body', ARRAY['Glutes', 'Quads', 'Hamstrings', 'Calves'], 'Intermediate', 'None (Bodyweight)', 'reps', 12, 35, 25, ARRAY['Lunge forward, push off rear foot smoothly into next stride'], ARRAY['Short choppy steps with poor depth'], true, true, 'lunge_pattern'),
('22222222-0000-0000-0000-000000000014', 'Curtsy Lunges', 'Lower body', ARRAY['Glutes', 'Hip mobility', 'Quads'], 'Intermediate', 'None (Bodyweight)', 'reps', 10, 30, 20, ARRAY['Step left foot diagonally behind right leg', 'Lower hips until front thigh is parallel', 'Rise and switch sides'], ARRAY['Twisting spine instead of moving hips'], true, true, 'lunge_pattern'),
('22222222-0000-0000-0000-000000000015', 'Side Lunge / Cossack Stretch', 'Lower body', ARRAY['Quads', 'Glutes', 'Hip mobility'], 'Intermediate', 'None (Bodyweight)', 'reps', 8, 30, 20, ARRAY['Wide stance, shift weight to one side bending knee', 'Keep other leg straight with foot planted', 'Switch sides'], ARRAY['Letting bent knee collapse inwards'], true, true, 'lunge_pattern'),

-- GLUTES & POSTERIOR CHAIN
('22222222-0000-0000-0000-000000000016', 'Glute Bridges', 'Lower body', ARRAY['Glutes', 'Hamstrings', 'Lower back'], 'Beginner', 'Mat', 'reps', 12, 30, 20, ARRAY['Lie on back with knees bent and feet flat', 'Drive through heels to lift hips', 'Squeeze glutes at top for 1 second'], ARRAY['Hyperextending lower back at top'], true, true, 'static_hold'),
('22222222-0000-0000-0000-000000000017', 'Single Leg Glute Bridge', 'Lower body', ARRAY['Glutes', 'Hamstrings', 'Core'], 'Intermediate', 'Mat', 'reps', 8, 30, 25, ARRAY['Lie on back, extend one leg upward', 'Drive through base heel to lift hips evenly'], ARRAY['Tilting pelvis to one side'], true, true, 'static_hold'),
('22222222-0000-0000-0000-000000000018', 'Donkey Kicks', 'Lower body', ARRAY['Glutes', 'Hamstrings'], 'Beginner', 'Mat', 'reps', 12, 30, 20, ARRAY['All fours position', 'Kick one foot up toward ceiling with knee bent 90 deg', 'Squeeze glute at top'], ARRAY['Arching lower back on upward kick'], true, true, 'static_hold'),
('22222222-0000-0000-0000-000000000019', 'Fire Hydrants', 'Lower body', ARRAY['Glutes', 'Hip mobility', 'Obliques'], 'Beginner', 'Mat', 'reps', 12, 30, 20, ARRAY['All fours, lift knee out to side at 90 deg angle', 'Lower with control'], ARRAY['Shifting all bodyweight to opposite arm'], true, true, 'static_hold'),
('22222222-0000-0000-0000-000000000020', 'Calf Raises (Double Leg)', 'Lower body', ARRAY['Calves'], 'Beginner', 'None (Bodyweight)', 'reps', 15, 30, 15, ARRAY['Stand tall, raise onto toes smoothly', 'Hold top position 1 sec, lower heels gently'], ARRAY['Bouncing without control'], true, true, 'static_hold'),
('22222222-0000-0000-0000-000000000021', 'Single Leg Calf Raises', 'Lower body', ARRAY['Calves'], 'Intermediate', 'Wall for balance', 'reps', 12, 30, 20, ARRAY['Balance on one foot', 'Raise heel high, control descent'], ARRAY['Rolling ankle outward'], true, true, 'static_hold'),

-- CORE & ABS PROGRESSION CHAIN
('22222222-0000-0000-0000-000000000022', 'Knee Plank Hold', 'Core', ARRAY['Core', 'Abs', 'Shoulders'], 'Beginner', 'Mat', 'time', 1, 20, 20, ARRAY['Forearms and knees on mat', 'Straight line from head to knees', 'Engage core gently'], ARRAY['Holding breath', 'Sagging hips'], true, true, 'plank_pattern'),
('22222222-0000-0000-0000-000000000023', 'Forearm Plank Hold', 'Core', ARRAY['Core', 'Abs', 'Shoulders', 'Glutes'], 'Beginner', 'Mat', 'time', 1, 30, 20, ARRAY['Forearms and toes on mat', 'Draw belly button in', 'Maintain rigid flat torso'], ARRAY['Dropping lower back', 'Piking hips'], true, true, 'plank_pattern'),
('22222222-0000-0000-0000-000000000024', 'Plank Shoulder Taps', 'Core', ARRAY['Core', 'Shoulders', 'Obliques', 'Abs'], 'Intermediate', 'Mat', 'reps', 12, 35, 25, ARRAY['High plank stance with feet slightly wider', 'Tap opposite shoulder with hand without rocking hips'], ARRAY['Excessive hip swaying'], true, true, 'plank_pattern'),
('22222222-0000-0000-0000-000000000025', 'Side Plank Hold (Knee down)', 'Core', ARRAY['Obliques', 'Core', 'Shoulders'], 'Beginner', 'Mat', 'time', 1, 20, 20, ARRAY['Lie on side on forearm with bottom knee bent on floor', 'Lift hips to form straight line'], ARRAY['Collapsing top shoulder forward'], true, true, 'plank_pattern'),
('22222222-0000-0000-0000-000000000026', 'Full Side Plank Hold', 'Core', ARRAY['Obliques', 'Core', 'Shoulders'], 'Intermediate', 'Mat', 'time', 1, 30, 25, ARRAY['Forearm and edge of feet on mat', 'Lift hips high, extend top arm'], ARRAY['Dropping hips toward floor'], true, true, 'plank_pattern'),
('22222222-0000-0000-0000-000000000027', 'Dead Bug', 'Core', ARRAY['Abs', 'Core', 'Lower back'], 'Beginner', 'Mat', 'reps', 10, 30, 20, ARRAY['Lie on back, arms up and knees 90 deg', 'Lower right arm and left leg simultaneously without arching back', 'Return and switch'], ARRAY['Lower back lifting off mat'], true, true, 'static_hold'),
('22222222-0000-0000-0000-000000000028', 'Bird Dog', 'Core', ARRAY['Core', 'Back', 'Glutes', 'Lower back'], 'Beginner', 'Mat', 'reps', 10, 30, 20, ARRAY['On hands and knees', 'Extend right arm forward and left leg back parallel to floor', 'Pause 1 sec, return and switch'], ARRAY['Twisting torso sideways'], true, true, 'static_hold'),
('22222222-0000-0000-0000-000000000029', 'Bicycle Crunches', 'Core', ARRAY['Abs', 'Obliques'], 'Intermediate', 'Mat', 'reps', 14, 30, 20, ARRAY['Hands behind head, bring opposite elbow to knee while extending other leg', 'Rotate ribs, not neck'], ARRAY['Pulling on neck'], true, true, 'squat_pattern'),
('22222222-0000-0000-0000-000000000030', 'Heel Touches', 'Core', ARRAY['Obliques', 'Abs'], 'Beginner', 'Mat', 'reps', 16, 30, 15, ARRAY['Lie on back knees bent, reach hand sideways to touch heel', 'Alternate sides smoothly'], ARRAY['Straining neck'], true, true, 'static_hold'),

-- UPPER BODY & BACK / POSTURE
('22222222-0000-0000-0000-000000000031', 'Prone Cobra / Back Extension', 'Upper body', ARRAY['Back', 'Shoulders', 'Lower back'], 'Beginner', 'Mat', 'reps', 10, 30, 20, ARRAY['Lie facedown, arms at sides palms down', 'Lift chest and hands gently, squeeze shoulder blades', 'Lower slowly'], ARRAY['Throwing head back'], true, true, 'static_hold'),
('22222222-0000-0000-0000-000000000032', 'Doorway Chest Stretch & Rows', 'Upper body', ARRAY['Back', 'Biceps', 'Shoulders'], 'Beginner', 'Doorframe', 'reps', 10, 30, 20, ARRAY['Hold doorframe, lean back slightly', 'Pull chest toward frame squeezing mid-back'], ARRAY['Jerking motion'], true, true, 'push_pattern'),
('22222222-0000-0000-0000-000000000033', 'Arm Circles (Small to Large)', 'Upper body', ARRAY['Shoulders', 'Upper body'], 'Beginner', 'None (Bodyweight)', 'time', 1, 30, 15, ARRAY['Extend arms straight out to sides', 'Make controlled circular motions forward then backward'], ARRAY['Shrugging shoulders into ears'], true, true, 'stretch_pattern'),
('22222222-0000-0000-0000-000000000034', 'Chair Triceps Dips (Bent Knees)', 'Upper body', ARRAY['Triceps', 'Shoulders', 'Chest'], 'Beginner', 'Chair', 'reps', 8, 30, 20, ARRAY['Hands on chair edge, knees bent 90 deg', 'Lower hips by bending elbows to 90 deg', 'Press back up'], ARRAY['Flaring elbows wide', 'Shoulders rolling forward'], true, true, 'push_pattern'),
('22222222-0000-0000-0000-000000000035', 'Chair Triceps Dips (Straight Legs)', 'Upper body', ARRAY['Triceps', 'Shoulders', 'Chest'], 'Intermediate', 'Chair', 'reps', 10, 30, 25, ARRAY['Legs extended straight out', 'Lower hips with controlled elbows', 'Press through palms'], ARRAY['Sinking into shoulders'], true, true, 'push_pattern'),
('22222222-0000-0000-0000-000000000036', 'Wall Angels', 'Upper body', ARRAY['Shoulders', 'Back', 'Hip mobility'], 'Beginner', 'Wall', 'reps', 10, 30, 15, ARRAY['Back and arms flat against wall in goalpost shape', 'Slide arms up and down keeping contact'], ARRAY['Arching lower back away from wall'], true, true, 'stretch_pattern'),

-- FULL BODY & CARDIO / LOW-IMPACT ALTERNATIVES
('22222222-0000-0000-0000-000000000037', 'Step Jacks (Low-Impact)', 'Full body', ARRAY['Full body', 'Shoulders', 'Calves'], 'Beginner', 'None (Bodyweight)', 'time', 1, 30, 15, ARRAY['Step right foot out while raising arms overhead', 'Return and step left foot out', 'Rhythmic and quiet'], ARRAY['Stiff knees'], true, true, 'jumping_pattern'),
('22222222-0000-0000-0000-000000000038', 'Jumping Jacks', 'Full body', ARRAY['Full body', 'Calves', 'Shoulders'], 'Intermediate', 'None (Bodyweight)', 'time', 1, 30, 20, ARRAY['Jump feet out while arms clap overhead', 'Jump back to center softly on balls of feet'], ARRAY['Heavy heel striking'], false, false, 'jumping_pattern'),
('22222222-0000-0000-0000-000000000039', 'Quiet High Knees March', 'Full body', ARRAY['Core', 'Quads', 'Calves'], 'Beginner', 'None (Bodyweight)', 'time', 1, 30, 15, ARRAY['March in place bringing knees up to hip height with control', 'Pump arms smoothly'], ARRAY['Leaning torso backwards'], true, true, 'jumping_pattern'),
('22222222-0000-0000-0000-000000000040', 'Mountain Climbers (Slow & Controlled)', 'Full body', ARRAY['Core', 'Shoulders', 'Abs', 'Quads'], 'Intermediate', 'Mat', 'time', 1, 30, 20, ARRAY['High plank position', 'Drive right knee to chest smoothly, step back, switch sides'], ARRAY['Bouncing hips up and down'], true, true, 'plank_pattern'),
('22222222-0000-0000-0000-000000000041', 'Wall Sit Hold', 'Lower body', ARRAY['Quads', 'Glutes'], 'Beginner', 'Wall', 'time', 1, 30, 20, ARRAY['Back flat against wall, slide down until thighs are parallel to ground', 'Hold steady breathing calmly'], ARRAY['Resting hands on knees'], true, true, 'static_hold'),

-- MOBILITY & RECOVERY / MENSTRUAL CARE
('22222222-0000-0000-0000-000000000042', 'Cat-Cow Flow', 'Mobility', ARRAY['Lower back', 'Back', 'Core', 'Hip mobility'], 'Beginner', 'Mat', 'reps', 8, 30, 15, ARRAY['On hands and knees', 'Inhale: drop belly, lift chest (Cow)', 'Exhale: round spine, tuck chin (Cat)'], ARRAY['Forcing neck too far back'], true, true, 'stretch_pattern'),
('22222222-0000-0000-0000-000000000043', 'Child''s Pose Hold', 'Recovery', ARRAY['Lower back', 'Hip mobility', 'Back'], 'Beginner', 'Mat', 'time', 1, 45, 15, ARRAY['Knees wide, big toes touching', 'Sit hips back onto heels, extend arms forward on mat', 'Breathe deeply into pelvis'], ARRAY['Tensing neck or shoulders'], true, true, 'stretch_pattern'),
('22222222-0000-0000-0000-000000000044', 'Seated Forward Fold', 'Mobility', ARRAY['Hamstrings', 'Lower back', 'Calves'], 'Beginner', 'Mat', 'time', 1, 30, 15, ARRAY['Sit tall with legs straight', 'Hinge from hips reaching toward toes gently without forcing'], ARRAY['Rounding upper back forcefully'], true, true, 'stretch_pattern'),
('22222222-0000-0000-0000-000000000045', 'Butterfly Stretch / Pelvic Opener', 'Mobility', ARRAY['Hip mobility', 'Glutes', 'Lower back'], 'Beginner', 'Mat', 'time', 1, 40, 15, ARRAY['Soles of feet together, knees open wide', 'Gently press knees toward floor, tall posture'], ARRAY['Bouncing knees forcefully'], true, true, 'stretch_pattern'),
('22222222-0000-0000-0000-000000000046', 'Supine Spinal Twist', 'Recovery', ARRAY['Lower back', 'Obliques', 'Chest'], 'Beginner', 'Mat', 'time', 1, 40, 15, ARRAY['Lie on back, hug right knee in and guide it across body to the left', 'Look to right, relax shoulder into mat'], ARRAY['Lifting opposite shoulder off floor'], true, true, 'stretch_pattern'),
('22222222-0000-0000-0000-000000000047', 'Pigeon Pose (Assisted/Figure 4)', 'Mobility', ARRAY['Glutes', 'Hip mobility', 'Lower back'], 'Beginner', 'Mat', 'time', 1, 35, 15, ARRAY['Lie on back, cross right ankle over left knee', 'Gently pull left thigh toward chest'], ARRAY['Straining neck to look up'], true, true, 'stretch_pattern'),
('22222222-0000-0000-0000-000000000048', 'Standing Quad Stretch', 'Mobility', ARRAY['Quads', 'Hip mobility'], 'Beginner', 'Wall for balance', 'time', 1, 30, 15, ARRAY['Hold wall with one hand, grasp opposite ankle behind you', 'Tuck pelvis slightly, knees aligned'], ARRAY['Arching lower back'], true, true, 'stretch_pattern'),
('22222222-0000-0000-0000-000000000049', 'Legs-Up-The-Wall Rest', 'Recovery', ARRAY['Hamstrings', 'Calves', 'Lower back', 'Recovery'], 'Beginner', 'Wall and Mat', 'time', 1, 60, 15, ARRAY['Lie on back with hips near wall and legs extended vertically up wall', 'Arms relaxed, breathe slowly'], ARRAY['Tensing legs'], true, true, 'static_hold'),
('22222222-0000-0000-0000-000000000050', 'Deep Pelvic Diaphragm Breathing', 'Recovery', ARRAY['Core', 'Recovery'], 'Beginner', 'Mat', 'time', 1, 45, 10, ARRAY['Place hand on belly, inhale 4s expanding ribcage and pelvic floor', 'Exhale 6s smoothly'], ARRAY['Chest-only shallow breathing'], true, true, 'stretch_pattern')
ON CONFLICT (name) DO NOTHING;

-- Map Progression / Regression FKs
UPDATE exercises SET progression_exercise_id = '22222222-0000-0000-0000-000000000002' WHERE id = '22222222-0000-0000-0000-000000000001';
UPDATE exercises SET regression_exercise_id = '22222222-0000-0000-0000-000000000001', progression_exercise_id = '22222222-0000-0000-0000-000000000003' WHERE id = '22222222-0000-0000-0000-000000000002';
UPDATE exercises SET regression_exercise_id = '22222222-0000-0000-0000-000000000002', progression_exercise_id = '22222222-0000-0000-0000-000000000004' WHERE id = '22222222-0000-0000-0000-000000000003';
UPDATE exercises SET regression_exercise_id = '22222222-0000-0000-0000-000000000003', progression_exercise_id = '22222222-0000-0000-0000-000000000005' WHERE id = '22222222-0000-0000-0000-000000000004';
UPDATE exercises SET regression_exercise_id = '22222222-0000-0000-0000-000000000004' WHERE id = '22222222-0000-0000-0000-000000000005';

UPDATE exercises SET progression_exercise_id = '22222222-0000-0000-0000-000000000007' WHERE id = '22222222-0000-0000-0000-000000000006';
UPDATE exercises SET regression_exercise_id = '22222222-0000-0000-0000-000000000006', progression_exercise_id = '22222222-0000-0000-0000-000000000009' WHERE id = '22222222-0000-0000-0000-000000000007';
UPDATE exercises SET regression_exercise_id = '22222222-0000-0000-0000-000000000007', progression_exercise_id = '22222222-0000-0000-0000-000000000010' WHERE id = '22222222-0000-0000-0000-000000000009';

UPDATE exercises SET progression_exercise_id = '22222222-0000-0000-0000-000000000023' WHERE id = '22222222-0000-0000-0000-000000000022';
UPDATE exercises SET regression_exercise_id = '22222222-0000-0000-0000-000000000022', progression_exercise_id = '22222222-0000-0000-0000-000000000024' WHERE id = '22222222-0000-0000-0000-000000000023';
UPDATE exercises SET regression_exercise_id = '22222222-0000-0000-0000-000000000023' WHERE id = '22222222-0000-0000-0000-000000000024';

-- Foods Catalog
INSERT INTO foods (id, name, category, calories_approx, protein_g, carbs_g, fats_g, fiber_g, iron_mg, calcium_mg, folate_mcg, vitamin_c_mg, dietary_flags, highlights) VALUES
('33333333-0000-0000-0000-000000000001', 'Baby Spinach', 'Vegetables', 23, 2.9, 3.6, 0.4, 2.2, 2.7, 99, 194, 28, ARRAY['vegetarian', 'vegan', 'eggetarian', 'non-vegetarian'], ARRAY['Rich in Folate & Iron', 'Supports menstrual recovery']),
('33333333-0000-0000-0000-000000000002', 'Rolled Oats', 'Grains', 150, 5.0, 27.0, 2.5, 4.0, 1.8, 20, 14, 0, ARRAY['vegetarian', 'vegan', 'eggetarian', 'non-vegetarian'], ARRAY['Complex carbs for steady energy', 'High soluble fiber']),
('33333333-0000-0000-0000-000000000003', 'Chia Seeds', 'Seeds', 138, 4.7, 12.0, 8.7, 9.8, 2.2, 177, 29, 1.6, ARRAY['vegetarian', 'vegan', 'eggetarian', 'non-vegetarian'], ARRAY['Omega-3 healthy fats', 'Fiber-dense hydration aid']),
('33333333-0000-0000-0000-000000000004', 'Greek Yogurt (Plain)', 'Dairy', 130, 15.0, 6.0, 4.0, 0.0, 0.1, 200, 12, 0, ARRAY['vegetarian', 'eggetarian', 'non-vegetarian'], ARRAY['High protein', 'Calcium & probiotics for gut health']),
('33333333-0000-0000-0000-000000000005', 'Free-range Eggs', 'Protein', 140, 12.0, 1.0, 10.0, 0.0, 1.8, 50, 44, 0, ARRAY['eggetarian', 'non-vegetarian'], ARRAY['Choline & bioavailable protein', 'Vitamin D & B12']),
('33333333-0000-0000-0000-000000000006', 'Firm Tofu', 'Plant Protein', 120, 14.0, 2.0, 7.0, 1.5, 2.8, 350, 28, 0, ARRAY['vegetarian', 'vegan', 'eggetarian', 'non-vegetarian'], ARRAY['Plant-based complete protein', 'Calcium-rich']),
('33333333-0000-0000-0000-000000000007', 'Lentils (Cooked)', 'Legumes', 230, 18.0, 40.0, 0.8, 15.6, 6.6, 38, 358, 3, ARRAY['vegetarian', 'vegan', 'eggetarian', 'non-vegetarian'], ARRAY['High iron and folate', 'High fiber for digestive health']),
('33333333-0000-0000-0000-000000000008', 'Wild Salmon Fillet', 'Fish/Protein', 206, 22.0, 0.0, 12.0, 0.0, 0.8, 15, 25, 0, ARRAY['non-vegetarian'], ARRAY['Potent anti-inflammatory Omega-3', 'High protein']),
('33333333-0000-0000-0000-000000000009', 'Avocado', 'Fruits/Fats', 160, 2.0, 8.5, 14.7, 6.7, 0.6, 12, 81, 10, ARRAY['vegetarian', 'vegan', 'eggetarian', 'non-vegetarian'], ARRAY['Monounsaturated healthy fats', 'Potassium & vitamin E']),
('33333333-0000-0000-0000-000000000010', 'Sweet Potato', 'Root Vegetables', 112, 2.0, 26.0, 0.1, 3.9, 0.8, 38, 11, 22, ARRAY['vegetarian', 'vegan', 'eggetarian', 'non-vegetarian'], ARRAY['Vitamin A & antioxidant-rich', 'Sustained low-GI energy'])
ON CONFLICT (name) DO NOTHING;

-- Meals across all 4 Diet Preferences and Phases
INSERT INTO meals (id, title, meal_type, phase_target, dietary_preference, description, key_nutrients, prep_time_min, is_default) VALUES
-- VEGETARIAN MEALS
('44444444-0000-0000-0000-000000000001', 'Iron & Berry Warm Oatmeal', 'Breakfast', 'Menstrual', 'Vegetarian', 'Warm rolled oats cooked with almond milk, topped with chia seeds, pumpkin seeds, and antioxidant berries.', ARRAY['Iron', 'Fiber', 'Healthy Fats'], 10, true),
('44444444-0000-0000-0000-000000000002', 'Lentil & Spinach Nourish Bowl', 'Lunch', 'Menstrual', 'Vegetarian', 'Warm yellow dal with wilted baby spinach, brown basmati rice, and a splash of lemon juice to enhance iron absorption.', ARRAY['Iron', 'Folate', 'Protein', 'Vitamin C'], 20, true),
('44444444-0000-0000-0000-000000000003', 'Walnut & Dark Chocolate Energy Cup', 'Snack', 'Menstrual', 'Vegetarian', 'Raw walnuts paired with 70% dark chocolate and ginger herbal tea for cramp comfort.', ARRAY['Magnesium', 'Healthy Fats', 'Polyphenols'], 5, true),
('44444444-0000-0000-0000-000000000004', 'Ginger Tofu & Roasted Vegetable Curry', 'Dinner', 'Menstrual', 'Vegetarian', 'Comforting warming coconut curry with paneer or firm tofu, sweet potatoes, and steamed green beans.', ARRAY['Calcium', 'Protein', 'Fiber'], 25, true),

('44444444-0000-0000-0000-000000000005', 'Greek Yogurt & Flaxseed Power Bowl', 'Breakfast', 'Follicular', 'Vegetarian', 'Creamy plain Greek yogurt with freshly ground flaxseed, sliced banana, and wildflower honey.', ARRAY['Protein', 'Calcium', 'Probiotics'], 5, true),
('44444444-0000-0000-0000-000000000006', 'Quinoa Edamame Glow Salad', 'Lunch', 'Follicular', 'Vegetarian', 'Fluffy quinoa tossed with crisp edamame, shredded carrots, bell peppers, and sesame ginger dressing.', ARRAY['Complete Protein', 'Fiber', 'Vitamin C'], 15, true),
('44444444-0000-0000-0000-000000000007', 'Hummus & Crunchy Veggie Sticks', 'Snack', 'Follicular', 'Vegetarian', 'Creamy chickpea hummus with crisp cucumber, bell pepper, and carrot batons.', ARRAY['Fiber', 'Complex Carbs'], 5, true),
('44444444-0000-0000-0000-000000000008', 'Paneer Tikka & Spiced Quinoa Pilaf', 'Dinner', 'Follicular', 'Vegetarian', 'Lightly grilled herb paneer cubes served over fragrant spiced quinoa with roasted zucchini.', ARRAY['Protein', 'Calcium', 'B-Vitamins'], 25, true),

-- EGGETARIAN MEALS
('44444444-0000-0000-0000-000000000009', 'Spinach & Feta Scramble with Sourdough', 'Breakfast', 'Menstrual', 'Eggetarian', 'Two free-range eggs scrambled with wilted baby spinach and crumbled feta on toasted whole-grain sourdough.', ARRAY['Protein', 'Iron', 'Choline'], 10, true),
('44444444-0000-0000-0000-000000000010', 'Boiled Egg & Chickpea Mediterranean Bowl', 'Lunch', 'Follicular', 'Eggetarian', 'Soft-boiled eggs over spiced chickpeas, cucumbers, cherry tomatoes, and kalamata olives.', ARRAY['Protein', 'Folate', 'Healthy Fats'], 15, true),
('44444444-0000-0000-0000-000000000011', 'Herbed Egg Salad Lettuce Wraps', 'Snack', 'Ovulatory', 'Eggetarian', 'Diced eggs with avocado mayo and fresh dill in crisp romaine lettuce boats.', ARRAY['Protein', 'Healthy Fats'], 5, true),
('44444444-0000-0000-0000-000000000012', 'Sweet Potato & Veggie Frittata', 'Dinner', 'Luteal', 'Eggetarian', 'Baked egg frittata with roasted sweet potatoes, kale, and caramelized onions.', ARRAY['Vitamin A', 'Protein', 'Complex Carbs'], 25, true),

-- NON-VEGETARIAN MEALS
('44444444-0000-0000-0000-000000000013', 'Smoked Salmon & Avocado Toast', 'Breakfast', 'Menstrual', 'Non-vegetarian', 'Whole grain toast with mashed avocado, wild smoked salmon, and a sprinkle of hemp seeds.', ARRAY['Omega-3', 'Protein', 'Healthy Fats'], 8, true),
('44444444-0000-0000-0000-000000000014', 'Grilled Chicken & Warm Lentil Salad', 'Lunch', 'Follicular', 'Non-vegetarian', 'Herb-marinated grilled chicken breast served over warm beluga lentils and tender arugula.', ARRAY['Lean Protein', 'Iron', 'Fiber'], 20, true),
('44444444-0000-0000-0000-000000000015', 'Turkey Breast Roll-ups with Avocado', 'Snack', 'Ovulatory', 'Non-vegetarian', 'Lean sliced turkey breast rolled around avocado wedges and cucumber strips.', ARRAY['Protein', 'Healthy Fats'], 5, true),
('44444444-0000-0000-0000-000000000016', 'Pan-Seared Salmon with Asparagus & Sweet Potato', 'Dinner', 'Luteal', 'Non-vegetarian', 'Wild salmon fillet pan-seared with garlic-roasted asparagus spears and mashed sweet potato.', ARRAY['Omega-3', 'Potassium', 'Vitamin B6'], 25, true),

-- VEGAN MEALS
('44444444-0000-0000-0000-000000000017', 'Chia Pudding with Mango & Hemp Hearts', 'Breakfast', 'Menstrual', 'Vegan', 'Coconut-almond chia seed pudding topped with diced mango and hemp seeds.', ARRAY['Omega-3', 'Fiber', 'Magnesium'], 5, true),
('44444444-0000-0000-0000-000000000018', 'Spiced Tofu & Quinoa Rainbow Bowl', 'Lunch', 'Follicular', 'Vegan', 'Turmeric-crusted tofu cubes, tricolor quinoa, steamed broccoli florets, and tahini dressing.', ARRAY['Plant Protein', 'Calcium', 'Fiber'], 15, true),
('44444444-0000-0000-0000-000000000019', 'Apple Slices with Roasted Almond Butter', 'Snack', 'Ovulatory', 'Vegan', 'Crisp apple slices paired with 2 tablespoons of natural unsalted almond butter.', ARRAY['Healthy Fats', 'Fiber', 'Vitamin E'], 5, true),
('44444444-0000-0000-0000-000000000020', 'Moroccan Chickpea & Butternut Squash Tagine', 'Dinner', 'Luteal', 'Vegan', 'Slow-simmered chickpeas with sweet butternut squash, apricots, and cinnamon over brown rice.', ARRAY['Complex Carbs', 'Iron', 'Antioxidants'], 30, true)
ON CONFLICT (id) DO NOTHING;

-- Meal Items with diet-respecting substitution options
INSERT INTO meal_items (id, meal_id, food_name, portion, category, substitution_options) VALUES
('55555555-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000001', 'Rolled Oats', '1 cup cooked', 'Grains', '[{"name": "Quinoa Flakes", "reason": "Gluten-free complete protein"}, {"name": "Buckwheat Porridge", "reason": "High rutin and magnesium"}]'::jsonb),
('55555555-0000-0000-0000-000000000002', '44444444-0000-0000-0000-000000000001', 'Chia Seeds', '1 tbsp', 'Seeds', '[{"name": "Ground Flaxseed", "reason": "Rich in lignans & omega-3"}, {"name": "Hemp Hearts", "reason": "Higher protein & nutty flavor"}]'::jsonb),
('55555555-0000-0000-0000-000000000003', '44444444-0000-0000-0000-000000000002', 'Lentils (Cooked)', '1 cup', 'Legumes', '[{"name": "Chickpeas", "reason": "Slightly firmer texture and folate"}, {"name": "Black Beans", "reason": "Rich in anthocyanins"}]'::jsonb),
('55555555-0000-0000-0000-000000000004', '44444444-0000-0000-0000-000000000002', 'Baby Spinach', '2 cups wilted', 'Vegetables', '[{"name": "Steamed Kale", "reason": "High calcium & vitamin K"}, {"name": "Swiss Chard", "reason": "Earthy flavor and magnesium"}]'::jsonb),
('55555555-0000-0000-0000-000000000005', '44444444-0000-0000-0000-000000000009', 'Free-range Eggs', '2 large eggs', 'Protein', '[{"name": "Scrambled Tofu", "reason": "Plant-based soy isoflavone source"}, {"name": "Cottage Cheese", "reason": "High casein protein"}]'::jsonb),
('55555555-0000-0000-0000-000000000006', '44444444-0000-0000-0000-000000000013', 'Wild Salmon Fillet', '120g', 'Fish/Protein', '[{"name": "Mackerel", "reason": "Omega-3 rich alternative"}, {"name": "Grilled Tempeh", "reason": "Plant-based fermented protein"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Workout Templates
INSERT INTO workouts (id, title, description, category, phase_target, intensity, estimated_duration_min, is_quiet, is_low_impact) VALUES
('66666666-0000-0000-0000-000000000001', 'Gentle Menstrual Release & Mobility', 'Calming sequence designed to alleviate pelvic congestion, release lower back tension, and restore breath.', 'Recovery', 'Menstrual', 'Low', 12, true, true),
('66666666-0000-0000-0000-000000000002', 'Pelvic Ease & Gentle Stretch (5-min)', 'Short 5-minute restorative stretch ideal for cramp days or low motivation.', 'Mobility', 'Menstrual', 'Low', 5, true, true),
('66666666-0000-0000-0000-000000000003', 'Follicular Full-Body Energizer', 'Dynamic bodyweight routine tapping into rising energy with controlled squats, push progressions, and core taps.', 'Full body', 'Follicular', 'Moderate', 15, true, true),
('66666666-0000-0000-0000-000000000004', 'Ovulatory Peak Strength & Core', 'Full body strength circuit taking advantage of peak cycle stamina and endurance.', 'Full body', 'Ovulatory', 'Moderate', 20, true, true),
('66666666-0000-0000-0000-000000000005', 'Luteal Low-Impact Glute & Core Sculpt', 'Floor-based low-impact strengthening circuit focusing on steady posterior chain activation without overtaxing joints.', 'Lower body', 'Luteal', 'Low', 15, true, true),
('66666666-0000-0000-0000-000000000006', 'Quiet Apartment Upper Body & Posture', 'Zero jumping, noise-free upper body circuit targeting shoulders, chest, triceps, and upper back posture.', 'Upper body', 'Any', 'Moderate', 15, true, true),
('66666666-0000-0000-0000-000000000007', 'PCOS Metabolic Consistency Flow', 'Low-stress, insulin-sensitizing full body flow blending compound squats, gentle core, and mindful recovery.', 'Full body', 'Any', 'Low', 15, true, true),
('66666666-0000-0000-0000-000000000008', '10-Minute Deep Core & Lower Back Support', 'Targeted core stabilization protecting the lower back without high spinal flexion.', 'Core', 'Any', 'Moderate', 10, true, true)
ON CONFLICT (id) DO NOTHING;

-- Workout Exercises mapping
INSERT INTO workout_exercises (id, workout_id, exercise_id, order_index, mode, target, target_seconds, rest_seconds) VALUES
-- Menstrual Release & Mobility
('77777777-0000-0000-0000-000000000001', '66666666-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000042', 1, 'reps', 8, 30, 15), -- Cat Cow
('77777777-0000-0000-0000-000000000002', '66666666-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000043', 2, 'time', 1, 45, 15), -- Child's pose
('77777777-0000-0000-0000-000000000003', '66666666-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000045', 3, 'time', 1, 40, 15), -- Butterfly stretch
('77777777-0000-0000-0000-000000000004', '66666666-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000046', 4, 'time', 1, 40, 15), -- Supine twist
('77777777-0000-0000-0000-000000000005', '66666666-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000049', 5, 'time', 1, 60, 0),  -- Legs up wall

-- Follicular Energizer
('77777777-0000-0000-0000-000000000006', '66666666-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000037', 1, 'time', 1, 30, 15), -- Step Jacks
('77777777-0000-0000-0000-000000000007', '66666666-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000007', 2, 'reps', 12, 30, 20), -- Bodyweight Squats
('77777777-0000-0000-0000-000000000008', '66666666-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000003', 3, 'reps', 10, 30, 20), -- Knee Push-ups
('77777777-0000-0000-0000-000000000009', '66666666-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000016', 4, 'reps', 12, 30, 20), -- Glute Bridges
('77777777-0000-0000-0000-000000000010', '66666666-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000023', 5, 'time', 1, 30, 15), -- Forearm plank

-- Luteal Low-Impact Sculpt
('77777777-0000-0000-0000-000000000011', '66666666-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000016', 1, 'reps', 12, 30, 20), -- Glute Bridges
('77777777-0000-0000-0000-000000000012', '66666666-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000018', 2, 'reps', 12, 30, 20), -- Donkey Kicks
('77777777-0000-0000-0000-000000000013', '66666666-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000027', 3, 'reps', 10, 30, 20), -- Dead Bug
('77777777-0000-0000-0000-000000000014', '66666666-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000028', 4, 'reps', 10, 30, 20), -- Bird Dog
('77777777-0000-0000-0000-000000000015', '66666666-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000043', 5, 'time', 1, 45, 0)   -- Child's Pose
ON CONFLICT (id) DO NOTHING;
