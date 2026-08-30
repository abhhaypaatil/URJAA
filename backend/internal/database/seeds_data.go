package database

func (s *MemoryStorage) seedExercises() {
	exercises := []*ExerciseRecord{
		// UPPER BODY
		{
			ID: "22222222-0000-0000-0000-000000000001", Name: "Wall Push-ups", Category: "Upper body",
			MuscleGroups: []string{"Chest", "Shoulders", "Triceps"}, Difficulty: "Beginner", Equipment: "Wall",
			Type: "reps", DefaultReps: 10, DefaultDurationSeconds: 30, RestSeconds: 20,
			Instructions: []string{"Stand arm-length from wall", "Place palms at shoulder height", "Lower chest gently toward wall", "Push back with control"},
			CommonMistakes: []string{"Flaring elbows out too wide", "Arching lower back"},
			QuietFriendly: true, LowImpact: true, AnimationType: "push_pattern",
			ProgressionExerciseID: stringPtr("22222222-0000-0000-0000-000000000002"),
		},
		{
			ID: "22222222-0000-0000-0000-000000000002", Name: "Incline Push-ups", Category: "Upper body",
			MuscleGroups: []string{"Chest", "Shoulders", "Triceps"}, Difficulty: "Beginner", Equipment: "Chair or Table",
			Type: "reps", DefaultReps: 10, DefaultDurationSeconds: 30, RestSeconds: 20,
			Instructions: []string{"Hands on elevated sturdy surface", "Body in straight line", "Lower chest to edge", "Press up firmly"},
			CommonMistakes: []string{"Sagging hips", "Looking up and straining neck"},
			QuietFriendly: true, LowImpact: true, AnimationType: "push_pattern",
			ProgressionExerciseID: stringPtr("22222222-0000-0000-0000-000000000003"), RegressionExerciseID: stringPtr("22222222-0000-0000-0000-000000000001"),
		},
		{
			ID: "22222222-0000-0000-0000-000000000003", Name: "Knee Push-ups", Category: "Upper body",
			MuscleGroups: []string{"Chest", "Shoulders", "Triceps", "Core"}, Difficulty: "Beginner", Equipment: "Mat",
			Type: "reps", DefaultReps: 10, DefaultDurationSeconds: 30, RestSeconds: 20,
			Instructions: []string{"Knees on mat, crossed or flat", "Hands shoulder-width apart", "Lower chest to floor", "Push through palms"},
			CommonMistakes: []string{"Hips back in tabletop position", "Letting belly drop"},
			QuietFriendly: true, LowImpact: true, AnimationType: "push_pattern",
			ProgressionExerciseID: stringPtr("22222222-0000-0000-0000-000000000004"), RegressionExerciseID: stringPtr("22222222-0000-0000-0000-000000000002"),
		},
		{
			ID: "22222222-0000-0000-0000-000000000004", Name: "Standard Push-ups", Category: "Upper body",
			MuscleGroups: []string{"Chest", "Shoulders", "Triceps", "Core"}, Difficulty: "Intermediate", Equipment: "None (Bodyweight)",
			Type: "reps", DefaultReps: 10, DefaultDurationSeconds: 30, RestSeconds: 25,
			Instructions: []string{"High plank position", "Lower chest to 2 inches off floor", "Press smoothly to top lockout"},
			CommonMistakes: []string{"Piking hips upward", "Dropping head"},
			QuietFriendly: true, LowImpact: true, AnimationType: "push_pattern",
			ProgressionExerciseID: stringPtr("22222222-0000-0000-0000-000000000005"), RegressionExerciseID: stringPtr("22222222-0000-0000-0000-000000000003"),
		},
		{
			ID: "22222222-0000-0000-0000-000000000005", Name: "Diamond Push-ups", Category: "Upper body",
			MuscleGroups: []string{"Triceps", "Chest", "Shoulders"}, Difficulty: "Advanced", Equipment: "None (Bodyweight)",
			Type: "reps", DefaultReps: 8, DefaultDurationSeconds: 30, RestSeconds: 30,
			Instructions: []string{"Thumbs and index fingers touching under chest", "Lower body slowly", "Press through triceps"},
			CommonMistakes: []string{"Flaring elbows excessively"},
			QuietFriendly: true, LowImpact: true, AnimationType: "push_pattern",
			RegressionExerciseID: stringPtr("22222222-0000-0000-0000-000000000004"),
		},
		// SQUATS & LOWER BODY
		{
			ID: "22222222-0000-0000-0000-000000000006", Name: "Chair Squats (Assisted)", Category: "Lower body",
			MuscleGroups: []string{"Quads", "Glutes"}, Difficulty: "Beginner", Equipment: "Chair",
			Type: "reps", DefaultReps: 10, DefaultDurationSeconds: 30, RestSeconds: 20,
			Instructions: []string{"Stand in front of chair", "Hips back and touch chair lightly", "Stand up squeezing glutes"},
			CommonMistakes: []string{"Collapsing heavily onto chair", "Knees caving inwards"},
			QuietFriendly: true, LowImpact: true, AnimationType: "squat_pattern",
			ProgressionExerciseID: stringPtr("22222222-0000-0000-0000-000000000007"),
		},
		{
			ID: "22222222-0000-0000-0000-000000000007", Name: "Bodyweight Squats", Category: "Lower body",
			MuscleGroups: []string{"Quads", "Glutes", "Hamstrings"}, Difficulty: "Beginner", Equipment: "None (Bodyweight)",
			Type: "reps", DefaultReps: 12, DefaultDurationSeconds: 30, RestSeconds: 20,
			Instructions: []string{"Feet shoulder-width apart", "Sit hips back and down to parallel", "Drive through whole foot to stand"},
			CommonMistakes: []string{"Heels lifting off ground", "Rounding spine"},
			QuietFriendly: true, LowImpact: true, AnimationType: "squat_pattern",
			ProgressionExerciseID: stringPtr("22222222-0000-0000-0000-000000000009"), RegressionExerciseID: stringPtr("22222222-0000-0000-0000-000000000006"),
		},
		{
			ID: "22222222-0000-0000-0000-000000000008", Name: "Sumo Squats", Category: "Lower body",
			MuscleGroups: []string{"Glutes", "Quads", "Hip mobility"}, Difficulty: "Beginner", Equipment: "None (Bodyweight)",
			Type: "reps", DefaultReps: 12, DefaultDurationSeconds: 30, RestSeconds: 20,
			Instructions: []string{"Wide stance with toes pointed outward 45 deg", "Keep torso upright", "Descend deep and squeeze glutes on ascent"},
			CommonMistakes: []string{"Leaning too far forward"},
			QuietFriendly: true, LowImpact: true, AnimationType: "squat_pattern",
		},
		{
			ID: "22222222-0000-0000-0000-000000000009", Name: "Tempo Squats (3s down)", Category: "Lower body",
			MuscleGroups: []string{"Quads", "Glutes", "Hamstrings"}, Difficulty: "Intermediate", Equipment: "None (Bodyweight)",
			Type: "reps", DefaultReps: 10, DefaultDurationSeconds: 40, RestSeconds: 25,
			Instructions: []string{"Lower down for 3 slow seconds", "Pause 1 second at bottom", "Explode smoothly back up"},
			CommonMistakes: []string{"Rushing the descent"},
			QuietFriendly: true, LowImpact: true, AnimationType: "squat_pattern",
			ProgressionExerciseID: stringPtr("22222222-0000-0000-0000-000000000010"), RegressionExerciseID: stringPtr("22222222-0000-0000-0000-000000000007"),
		},
		{
			ID: "22222222-0000-0000-0000-000000000010", Name: "Jump Squats", Category: "Lower body",
			MuscleGroups: []string{"Quads", "Glutes", "Calves"}, Difficulty: "Advanced", Equipment: "None (Bodyweight)",
			Type: "reps", DefaultReps: 10, DefaultDurationSeconds: 30, RestSeconds: 30,
			Instructions: []string{"Squat down to parallel", "Explosively jump straight up", "Land softly toe-to-heel into next squat"},
			CommonMistakes: []string{"Heavy landing with stiff knees"},
			QuietFriendly: false, LowImpact: false, AnimationType: "jumping_pattern",
			RegressionExerciseID: stringPtr("22222222-0000-0000-0000-000000000009"),
		},
		// LUNGES & LOWER BODY
		{
			ID: "22222222-0000-0000-0000-000000000011", Name: "Supported Static Lunges", Category: "Lower body",
			MuscleGroups: []string{"Quads", "Glutes", "Hamstrings"}, Difficulty: "Beginner", Equipment: "Wall or Chair",
			Type: "reps", DefaultReps: 8, DefaultDurationSeconds: 30, RestSeconds: 20,
			Instructions: []string{"Hold chair for balance", "Step one leg back", "Lower back knee toward floor", "Push through front heel"},
			CommonMistakes: []string{"Front knee shooting past toes"},
			QuietFriendly: true, LowImpact: true, AnimationType: "lunge_pattern",
		},
		{
			ID: "22222222-0000-0000-0000-000000000012", Name: "Reverse Lunges", Category: "Lower body",
			MuscleGroups: []string{"Glutes", "Quads", "Hamstrings"}, Difficulty: "Beginner", Equipment: "None (Bodyweight)",
			Type: "reps", DefaultReps: 10, DefaultDurationSeconds: 30, RestSeconds: 20,
			Instructions: []string{"Step back with right leg", "Lower both knees to 90 degrees", "Return to standing and alternate"},
			CommonMistakes: []string{"Slamming back knee on floor"},
			QuietFriendly: true, LowImpact: true, AnimationType: "lunge_pattern",
		},
		{
			ID: "22222222-0000-0000-0000-000000000016", Name: "Glute Bridges", Category: "Lower body",
			MuscleGroups: []string{"Glutes", "Hamstrings", "Lower back"}, Difficulty: "Beginner", Equipment: "Mat",
			Type: "reps", DefaultReps: 12, DefaultDurationSeconds: 30, RestSeconds: 20,
			Instructions: []string{"Lie on back with knees bent and feet flat", "Drive through heels to lift hips", "Squeeze glutes at top for 1 sec"},
			CommonMistakes: []string{"Hyperextending lower back at top"},
			QuietFriendly: true, LowImpact: true, AnimationType: "static_hold",
		},
		{
			ID: "22222222-0000-0000-0000-000000000018", Name: "Donkey Kicks", Category: "Lower body",
			MuscleGroups: []string{"Glutes", "Hamstrings"}, Difficulty: "Beginner", Equipment: "Mat",
			Type: "reps", DefaultReps: 12, DefaultDurationSeconds: 30, RestSeconds: 20,
			Instructions: []string{"All fours position", "Kick one foot up toward ceiling with knee 90 deg", "Squeeze glute at top"},
			CommonMistakes: []string{"Arching lower back on upward kick"},
			QuietFriendly: true, LowImpact: true, AnimationType: "static_hold",
		},
		{
			ID: "22222222-0000-0000-0000-000000000020", Name: "Calf Raises (Double Leg)", Category: "Lower body",
			MuscleGroups: []string{"Calves"}, Difficulty: "Beginner", Equipment: "None (Bodyweight)",
			Type: "reps", DefaultReps: 15, DefaultDurationSeconds: 30, RestSeconds: 15,
			Instructions: []string{"Stand tall, raise onto toes smoothly", "Hold top position 1 sec, lower heels gently"},
			CommonMistakes: []string{"Bouncing without control"},
			QuietFriendly: true, LowImpact: true, AnimationType: "static_hold",
		},
		// CORE & ABS
		{
			ID: "22222222-0000-0000-0000-000000000022", Name: "Knee Plank Hold", Category: "Core",
			MuscleGroups: []string{"Core", "Abs", "Shoulders"}, Difficulty: "Beginner", Equipment: "Mat",
			Type: "time", DefaultReps: 1, DefaultDurationSeconds: 20, RestSeconds: 20,
			Instructions: []string{"Forearms and knees on mat", "Straight line from head to knees", "Engage core gently"},
			CommonMistakes: []string{"Holding breath", "Sagging hips"},
			QuietFriendly: true, LowImpact: true, AnimationType: "plank_pattern",
			ProgressionExerciseID: stringPtr("22222222-0000-0000-0000-000000000023"),
		},
		{
			ID: "22222222-0000-0000-0000-000000000023", Name: "Forearm Plank Hold", Category: "Core",
			MuscleGroups: []string{"Core", "Abs", "Shoulders", "Glutes"}, Difficulty: "Beginner", Equipment: "Mat",
			Type: "time", DefaultReps: 1, DefaultDurationSeconds: 30, RestSeconds: 20,
			Instructions: []string{"Forearms and toes on mat", "Draw belly button in", "Maintain rigid flat torso"},
			CommonMistakes: []string{"Dropping lower back", "Piking hips"},
			QuietFriendly: true, LowImpact: true, AnimationType: "plank_pattern",
			ProgressionExerciseID: stringPtr("22222222-0000-0000-0000-000000000024"), RegressionExerciseID: stringPtr("22222222-0000-0000-0000-000000000022"),
		},
		{
			ID: "22222222-0000-0000-0000-000000000024", Name: "Plank Shoulder Taps", Category: "Core",
			MuscleGroups: []string{"Core", "Shoulders", "Obliques", "Abs"}, Difficulty: "Intermediate", Equipment: "Mat",
			Type: "reps", DefaultReps: 12, DefaultDurationSeconds: 35, RestSeconds: 25,
			Instructions: []string{"High plank stance with feet wide", "Tap opposite shoulder with hand without rocking hips"},
			CommonMistakes: []string{"Excessive hip swaying"},
			QuietFriendly: true, LowImpact: true, AnimationType: "plank_pattern",
			RegressionExerciseID: stringPtr("22222222-0000-0000-0000-000000000023"),
		},
		{
			ID: "22222222-0000-0000-0000-000000000027", Name: "Dead Bug", Category: "Core",
			MuscleGroups: []string{"Abs", "Core", "Lower back"}, Difficulty: "Beginner", Equipment: "Mat",
			Type: "reps", DefaultReps: 10, DefaultDurationSeconds: 30, RestSeconds: 20,
			Instructions: []string{"Lie on back, arms up and knees 90 deg", "Lower right arm and left leg simultaneously", "Return and switch"},
			CommonMistakes: []string{"Lower back lifting off mat"},
			QuietFriendly: true, LowImpact: true, AnimationType: "static_hold",
		},
		{
			ID: "22222222-0000-0000-0000-000000000028", Name: "Bird Dog", Category: "Core",
			MuscleGroups: []string{"Core", "Back", "Glutes", "Lower back"}, Difficulty: "Beginner", Equipment: "Mat",
			Type: "reps", DefaultReps: 10, DefaultDurationSeconds: 30, RestSeconds: 20,
			Instructions: []string{"On hands and knees", "Extend right arm forward and left leg back parallel to floor", "Pause 1 sec, return and switch"},
			CommonMistakes: []string{"Twisting torso sideways"},
			QuietFriendly: true, LowImpact: true, AnimationType: "static_hold",
		},
		// CARDIO / FULL BODY
		{
			ID: "22222222-0000-0000-0000-000000000037", Name: "Step Jacks (Low-Impact)", Category: "Full body",
			MuscleGroups: []string{"Full body", "Shoulders", "Calves"}, Difficulty: "Beginner", Equipment: "None (Bodyweight)",
			Type: "time", DefaultReps: 1, DefaultDurationSeconds: 30, RestSeconds: 15,
			Instructions: []string{"Step right foot out while raising arms overhead", "Return and step left foot out", "Rhythmic and quiet"},
			CommonMistakes: []string{"Stiff knees"},
			QuietFriendly: true, LowImpact: true, AnimationType: "jumping_pattern",
		},
		{
			ID: "22222222-0000-0000-0000-000000000038", Name: "Jumping Jacks", Category: "Full body",
			MuscleGroups: []string{"Full body", "Calves", "Shoulders"}, Difficulty: "Intermediate", Equipment: "None (Bodyweight)",
			Type: "time", DefaultReps: 1, DefaultDurationSeconds: 30, RestSeconds: 20,
			Instructions: []string{"Jump feet out while arms clap overhead", "Jump back to center softly on balls of feet"},
			CommonMistakes: []string{"Heavy heel striking"},
			QuietFriendly: false, LowImpact: false, AnimationType: "jumping_pattern",
		},
		// MOBILITY & RECOVERY
		{
			ID: "22222222-0000-0000-0000-000000000042", Name: "Cat-Cow Flow", Category: "Mobility",
			MuscleGroups: []string{"Lower back", "Back", "Core", "Hip mobility"}, Difficulty: "Beginner", Equipment: "Mat",
			Type: "reps", DefaultReps: 8, DefaultDurationSeconds: 30, RestSeconds: 15,
			Instructions: []string{"On hands and knees", "Inhale: drop belly, lift chest (Cow)", "Exhale: round spine, tuck chin (Cat)"},
			CommonMistakes: []string{"Forcing neck too far back"},
			QuietFriendly: true, LowImpact: true, AnimationType: "stretch_pattern",
		},
		{
			ID: "22222222-0000-0000-0000-000000000043", Name: "Child's Pose Hold", Category: "Recovery",
			MuscleGroups: []string{"Lower back", "Hip mobility", "Back"}, Difficulty: "Beginner", Equipment: "Mat",
			Type: "time", DefaultReps: 1, DefaultDurationSeconds: 45, RestSeconds: 15,
			Instructions: []string{"Knees wide, big toes touching", "Sit hips back onto heels, extend arms forward on mat", "Breathe deeply into pelvis"},
			CommonMistakes: []string{"Tensing neck or shoulders"},
			QuietFriendly: true, LowImpact: true, AnimationType: "stretch_pattern",
		},
		{
			ID: "22222222-0000-0000-0000-000000000045", Name: "Butterfly Stretch / Pelvic Opener", Category: "Mobility",
			MuscleGroups: []string{"Hip mobility", "Glutes", "Lower back"}, Difficulty: "Beginner", Equipment: "Mat",
			Type: "time", DefaultReps: 1, DefaultDurationSeconds: 40, RestSeconds: 15,
			Instructions: []string{"Soles of feet together, knees open wide", "Gently press knees toward floor, tall posture"},
			CommonMistakes: []string{"Bouncing knees forcefully"},
			QuietFriendly: true, LowImpact: true, AnimationType: "stretch_pattern",
		},
		{
			ID: "22222222-0000-0000-0000-000000000046", Name: "Supine Spinal Twist", Category: "Recovery",
			MuscleGroups: []string{"Lower back", "Obliques", "Chest"}, Difficulty: "Beginner", Equipment: "Mat",
			Type: "time", DefaultReps: 1, DefaultDurationSeconds: 40, RestSeconds: 15,
			Instructions: []string{"Lie on back, hug right knee in and guide it across body to the left", "Look to right, relax shoulder into mat"},
			CommonMistakes: []string{"Lifting opposite shoulder off floor"},
			QuietFriendly: true, LowImpact: true, AnimationType: "stretch_pattern",
		},
		{
			ID: "22222222-0000-0000-0000-000000000049", Name: "Legs-Up-The-Wall Rest", Category: "Recovery",
			MuscleGroups: []string{"Hamstrings", "Calves", "Lower back", "Recovery"}, Difficulty: "Beginner", Equipment: "Wall and Mat",
			Type: "time", DefaultReps: 1, DefaultDurationSeconds: 60, RestSeconds: 15,
			Instructions: []string{"Lie on back with hips near wall and legs extended vertically up wall", "Arms relaxed, breathe slowly"},
			CommonMistakes: []string{"Tensing legs"},
			QuietFriendly: true, LowImpact: true, AnimationType: "static_hold",
		},
	}

	for _, ex := range exercises {
		s.Exercises[ex.ID] = ex
	}
}

func (s *MemoryStorage) seedMeals() {
	meals := []*MealRecord{
		// VEGETARIAN
		{
			ID: "44444444-0000-0000-0000-000000000001", Title: "Iron & Berry Warm Oatmeal", MealType: "Breakfast",
			PhaseTarget: "Menstrual", DietaryPreference: "Vegetarian",
			Description: "Warm rolled oats cooked with almond milk, topped with chia seeds, pumpkin seeds, and antioxidant berries.",
			KeyNutrients: []string{"Iron", "Fiber", "Healthy Fats"}, PrepTimeMin: 10,
			Items: []MealItemRecord{
				{ID: "55555555-0000-0000-0000-000000000001", MealID: "44444444-0000-0000-0000-000000000001", FoodName: "Rolled Oats", Portion: "1 cup cooked", Category: "Grains", SubstitutionOptions: []SubstitutionOption{{Name: "Quinoa Flakes", Reason: "Gluten-free complete protein"}, {Name: "Buckwheat Porridge", Reason: "High magnesium"}}},
				{ID: "55555555-0000-0000-0000-000000000002", MealID: "44444444-0000-0000-0000-000000000001", FoodName: "Chia Seeds", Portion: "1 tbsp", Category: "Seeds", SubstitutionOptions: []SubstitutionOption{{Name: "Ground Flaxseed", Reason: "Rich in omega-3"}, {Name: "Hemp Hearts", Reason: "Higher protein"}}},
			},
		},
		{
			ID: "44444444-0000-0000-0000-000000000002", Title: "Lentil & Spinach Nourish Bowl", MealType: "Lunch",
			PhaseTarget: "Menstrual", DietaryPreference: "Vegetarian",
			Description: "Warm yellow dal with wilted baby spinach, brown basmati rice, and a splash of lemon juice to enhance iron absorption.",
			KeyNutrients: []string{"Iron", "Folate", "Protein", "Vitamin C"}, PrepTimeMin: 20,
			Items: []MealItemRecord{
				{ID: "55555555-0000-0000-0000-000000000003", MealID: "44444444-0000-0000-0000-000000000002", FoodName: "Lentils (Cooked)", Portion: "1 cup", Category: "Legumes", SubstitutionOptions: []SubstitutionOption{{Name: "Chickpeas", Reason: "Firm texture and folate"}, {Name: "Black Beans", Reason: "High anthocyanins"}}},
			},
		},
		{
			ID: "44444444-0000-0000-0000-000000000003", Title: "Walnut & Dark Chocolate Energy Cup", MealType: "Snack",
			PhaseTarget: "Menstrual", DietaryPreference: "Vegetarian",
			Description: "Raw walnuts paired with 70% dark chocolate and ginger herbal tea for cramp comfort.",
			KeyNutrients: []string{"Magnesium", "Healthy Fats", "Polyphenols"}, PrepTimeMin: 5,
		},
		{
			ID: "44444444-0000-0000-0000-000000000004", Title: "Ginger Tofu & Roasted Vegetable Curry", MealType: "Dinner",
			PhaseTarget: "Menstrual", DietaryPreference: "Vegetarian",
			Description: "Comforting warming coconut curry with paneer or firm tofu, sweet potatoes, and steamed green beans.",
			KeyNutrients: []string{"Calcium", "Protein", "Fiber"}, PrepTimeMin: 25,
		},
		// EGGETARIAN
		{
			ID: "44444444-0000-0000-0000-000000000009", Title: "Spinach & Feta Scramble with Sourdough", MealType: "Breakfast",
			PhaseTarget: "Menstrual", DietaryPreference: "Eggetarian",
			Description: "Two free-range eggs scrambled with wilted baby spinach and crumbled feta on toasted whole-grain sourdough.",
			KeyNutrients: []string{"Protein", "Iron", "Choline"}, PrepTimeMin: 10,
			Items: []MealItemRecord{
				{ID: "55555555-0000-0000-0000-000000000005", MealID: "44444444-0000-0000-0000-000000000009", FoodName: "Free-range Eggs", Portion: "2 large eggs", Category: "Protein", SubstitutionOptions: []SubstitutionOption{{Name: "Scrambled Tofu", Reason: "Plant-based soy isoflavones"}, {Name: "Cottage Cheese", Reason: "High casein protein"}}},
			},
		},
		// NON-VEGETARIAN
		{
			ID: "44444444-0000-0000-0000-000000000013", Title: "Smoked Salmon & Avocado Toast", MealType: "Breakfast",
			PhaseTarget: "Menstrual", DietaryPreference: "Non-vegetarian",
			Description: "Whole grain toast with mashed avocado, wild smoked salmon, and a sprinkle of hemp seeds.",
			KeyNutrients: []string{"Omega-3", "Protein", "Healthy Fats"}, PrepTimeMin: 8,
			Items: []MealItemRecord{
				{ID: "55555555-0000-0000-0000-000000000006", MealID: "44444444-0000-0000-0000-000000000013", FoodName: "Wild Salmon Fillet", Portion: "120g", Category: "Fish/Protein", SubstitutionOptions: []SubstitutionOption{{Name: "Mackerel", Reason: "Omega-3 alternative"}, {Name: "Grilled Tempeh", Reason: "Fermented plant protein"}}},
			},
		},
		// VEGAN
		{
			ID: "44444444-0000-0000-0000-000000000017", Title: "Chia Pudding with Mango & Hemp Hearts", MealType: "Breakfast",
			PhaseTarget: "Menstrual", DietaryPreference: "Vegan",
			Description: "Coconut-almond chia seed pudding topped with diced mango and hemp seeds.",
			KeyNutrients: []string{"Omega-3", "Fiber", "Magnesium"}, PrepTimeMin: 5,
		},
	}

	for _, m := range meals {
		s.Meals[m.ID] = m
	}
}

func (s *MemoryStorage) seedWorkouts() {
	workouts := []*WorkoutRecord{
		{
			ID: "66666666-0000-0000-0000-000000000001", Title: "Gentle Menstrual Release & Mobility",
			Description: "Calming sequence designed to alleviate pelvic congestion, release lower back tension, and restore breath.",
			Category: "Recovery", PhaseTarget: "Menstrual", Intensity: "Low", EstimatedDurationMin: 12, IsQuiet: true, IsLowImpact: true,
			Exercises: []WorkoutExerciseMapping{
				{ExerciseID: "22222222-0000-0000-0000-000000000042", OrderIndex: 1, Mode: "reps", Target: 8, TargetSeconds: 30, RestSeconds: 15},
				{ExerciseID: "22222222-0000-0000-0000-000000000043", OrderIndex: 2, Mode: "time", Target: 1, TargetSeconds: 45, RestSeconds: 15},
				{ExerciseID: "22222222-0000-0000-0000-000000000045", OrderIndex: 3, Mode: "time", Target: 1, TargetSeconds: 40, RestSeconds: 15},
				{ExerciseID: "22222222-0000-0000-0000-000000000046", OrderIndex: 4, Mode: "time", Target: 1, TargetSeconds: 40, RestSeconds: 15},
				{ExerciseID: "22222222-0000-0000-0000-000000000049", OrderIndex: 5, Mode: "time", Target: 1, TargetSeconds: 60, RestSeconds: 0},
			},
		},
		{
			ID: "66666666-0000-0000-0000-000000000003", Title: "Follicular Full-Body Energizer",
			Description: "Dynamic bodyweight routine tapping into rising energy with controlled squats, push progressions, and core taps.",
			Category: "Full body", PhaseTarget: "Follicular", Intensity: "Moderate", EstimatedDurationMin: 15, IsQuiet: true, IsLowImpact: true,
			Exercises: []WorkoutExerciseMapping{
				{ExerciseID: "22222222-0000-0000-0000-000000000037", OrderIndex: 1, Mode: "time", Target: 1, TargetSeconds: 30, RestSeconds: 15},
				{ExerciseID: "22222222-0000-0000-0000-000000000007", OrderIndex: 2, Mode: "reps", Target: 12, TargetSeconds: 30, RestSeconds: 20},
				{ExerciseID: "22222222-0000-0000-0000-000000000003", OrderIndex: 3, Mode: "reps", Target: 10, TargetSeconds: 30, RestSeconds: 20},
				{ExerciseID: "22222222-0000-0000-0000-000000000016", OrderIndex: 4, Mode: "reps", Target: 12, TargetSeconds: 30, RestSeconds: 20},
				{ExerciseID: "22222222-0000-0000-0000-000000000023", OrderIndex: 5, Mode: "time", Target: 1, TargetSeconds: 30, RestSeconds: 15},
			},
		},
	}

	for _, w := range workouts {
		// populate exercises pointers
		for i, item := range w.Exercises {
			if ex, ok := s.Exercises[item.ExerciseID]; ok {
				w.Exercises[i].Exercise = ex
			}
		}
		s.Workouts[w.ID] = w
	}
}

func stringPtr(s string) *string {
	return &s
}
