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
		// --- VEGETARIAN INDIAN MEALS ---
		{
			ID: "44444444-0000-0000-0000-000000000001", Title: "Kanda Poha with Peanuts & Curry Leaves", MealType: "Breakfast",
			PhaseTarget: "Follicular", DietaryPreference: "Vegetarian",
			Description: "Light flattened rice tossed with roasted mustard seeds, crunchy peanuts, turmeric, and fresh lemon. Gentle on digestion and rich in bio-available iron.",
			KeyNutrients: []string{"Iron", "Complex Carbs", "Vitamin C", "Healthy Fats"}, PrepTimeMin: 15,
			Items: []MealItemRecord{
				{ID: "55555555-0000-0000-0000-000000000001", MealID: "44444444-0000-0000-0000-000000000001", FoodName: "Thick Poha (Flattened Rice)", Portion: "1.5 cups cooked", Category: "Grains", SubstitutionOptions: []SubstitutionOption{{Name: "Red Rice Poha", Reason: "Higher antioxidant anthocyanins"}, {Name: "Oats Upma", Reason: "Higher beta-glucan fiber"}}},
				{ID: "55555555-0000-0000-0000-000000000002", MealID: "44444444-0000-0000-0000-000000000001", FoodName: "Roasted Peanuts", Portion: "2 tbsp", Category: "Nuts", SubstitutionOptions: []SubstitutionOption{{Name: "Roasted Almonds", Reason: "Higher vitamin E"}, {Name: "Boiled Sprouts", Reason: "Lower fat protein boost"}}},
			},
		},
		{
			ID: "44444444-0000-0000-0000-000000000002", Title: "Moong Dal & Spinach Chilla with Mint Chutney", MealType: "Breakfast",
			PhaseTarget: "Menstrual", DietaryPreference: "Vegetarian",
			Description: "Savory protein-dense yellow moong dal crepes blended with tender spinach, ginger, and cumin. Paired with digestive fresh mint chutney.",
			KeyNutrients: []string{"Plant Protein", "Folate", "Iron", "Zinc"}, PrepTimeMin: 15,
			Items: []MealItemRecord{
				{ID: "55555555-0000-0000-0000-000000000003", MealID: "44444444-0000-0000-0000-000000000002", FoodName: "Yellow Moong Dal Batter", Portion: "2 medium chillas", Category: "Legumes", SubstitutionOptions: []SubstitutionOption{{Name: "Besan (Chickpea Flour)", Reason: "Quick preparation"}, {Name: "Sprouted Ragi Dosa", Reason: "High calcium"}}},
			},
		},
		{
			ID: "44444444-0000-0000-0000-000000000003", Title: "Steamed Idlis with Drumstick Sambar & Chutney", MealType: "Breakfast",
			PhaseTarget: "Ovulatory", DietaryPreference: "Vegetarian",
			Description: "Soft, naturally fermented rice-lentil cakes served with piping hot toor dal sambar rich in drumsticks, carrots, and mild coconut chutney.",
			KeyNutrients: []string{"Gut Probiotics", "Protein", "Fiber", "Potassium"}, PrepTimeMin: 15,
		},
		{
			ID: "44444444-0000-0000-0000-000000000004", Title: "Dal Tadka with Phulkas & Cucumber Raita", MealType: "Lunch",
			PhaseTarget: "Any", DietaryPreference: "Vegetarian",
			Description: "Comforting yellow lentil curry tempered with ghee, cumin, and garlic, paired with 2 whole wheat phulkas and cooling cucumber curd.",
			KeyNutrients: []string{"Protein", "B-Vitamins", "Calcium", "Hydration"}, PrepTimeMin: 25,
			Items: []MealItemRecord{
				{ID: "55555555-0000-0000-0000-000000000004", MealID: "44444444-0000-0000-0000-000000000004", FoodName: "Toor & Moong Dal", Portion: "1 bowl (200ml)", Category: "Legumes", SubstitutionOptions: []SubstitutionOption{{Name: "Panchmel Dal", Reason: "5-lentil broad amino acids"}, {Name: "Chana Dal", Reason: "Lower glycemic response"}}},
			},
		},
		{
			ID: "44444444-0000-0000-0000-000000000005", Title: "Palak Paneer with Jowar Roti & Beet Salad", MealType: "Lunch",
			PhaseTarget: "Luteal", DietaryPreference: "Vegetarian",
			Description: "Tender paneer cubes simmered in spiced fresh spinach puree, accompanied by gluten-free jowar (sorghum) flatbread and grated beetroot salad.",
			KeyNutrients: []string{"Calcium", "High Protein", "Magnesium", "Fiber"}, PrepTimeMin: 30,
		},
		{
			ID: "44444444-0000-0000-0000-000000000006", Title: "Rajma Masala with Steamed Brown Rice", MealType: "Dinner",
			PhaseTarget: "Follicular", DietaryPreference: "Vegetarian",
			Description: "Slow-simmered red kidney beans in aromatic onion-tomato masala, served over steamed brown basmati rice with crunchy kachumber.",
			KeyNutrients: []string{"Iron", "Resistant Starch", "Potassium", "Fiber"}, PrepTimeMin: 30,
		},
		{
			ID: "44444444-0000-0000-0000-000000000007", Title: "Moong Dal Khichdi with Curd & Roasted Cumin", MealType: "Dinner",
			PhaseTarget: "Menstrual", DietaryPreference: "Vegetarian",
			Description: "Ayurvedic-inspired comfort meal of split yellow moong and fragrant rice cooked soft with a touch of cow's ghee and asafoetida. Extremely soothing during menstruation.",
			KeyNutrients: []string{"Gentle Digestion", "Complete Protein", "Probiotics"}, PrepTimeMin: 20,
		},
		{
			ID: "44444444-0000-0000-0000-000000000008", Title: "Roasted Makhana with Turmeric & Salt", MealType: "Snack",
			PhaseTarget: "Any", DietaryPreference: "Vegetarian",
			Description: "Crispy roasted foxnuts (lotus seeds) seasoned with clarifying turmeric, black pepper, and Himalayan pink rock salt.",
			KeyNutrients: []string{"Magnesium", "Antioxidants", "Low Sodium", "Crunch"}, PrepTimeMin: 5,
		},
		{
			ID: "44444444-0000-0000-0000-000000000009", Title: "Sprouted Moong Chaat with Pomegranate", MealType: "Snack",
			PhaseTarget: "Any", DietaryPreference: "Vegetarian",
			Description: "Live sprouted green gram tossed with diced cucumber, tomatoes, ruby pomegranate pearls, and fresh lime juice.",
			KeyNutrients: []string{"Enzymes", "Vitamin C", "Folate", "Fiber"}, PrepTimeMin: 5,
		},

		// --- NON-VEGETARIAN INDIAN MEALS ---
		{
			ID: "44444444-0000-0000-0000-000000000010", Title: "Masala Egg Bhurji with Whole Wheat Toast", MealType: "Breakfast",
			PhaseTarget: "Follicular", DietaryPreference: "Non-vegetarian",
			Description: "Two free-range eggs scrambled Indian-style with finely diced onions, ripe tomatoes, green chilies, and fresh coriander.",
			KeyNutrients: []string{"Complete Protein", "Choline", "B12", "Healthy Fats"}, PrepTimeMin: 12,
			Items: []MealItemRecord{
				{ID: "55555555-0000-0000-0000-000000000010", MealID: "44444444-0000-0000-0000-000000000010", FoodName: "Free-range Eggs", Portion: "2 large eggs", Category: "Poultry", SubstitutionOptions: []SubstitutionOption{{Name: "Paneer Bhurji", Reason: "Vegetarian swap"}, {Name: "Egg White Scramble", Reason: "Lower calorie"}}},
			},
		},
		{
			ID: "44444444-0000-0000-0000-000000000011", Title: "Homestyle Chicken Curry with Steamed Rice", MealType: "Lunch",
			PhaseTarget: "Ovulatory", DietaryPreference: "Non-vegetarian",
			Description: "Tender chicken breast pieces stewed in a light, aromatic ginger-garlic and tomato-onion gravy, served with steamed basmati rice and sliced kachumber.",
			KeyNutrients: []string{"Lean Protein", "Heme Iron", "Niacin", "Zinc"}, PrepTimeMin: 35,
			Items: []MealItemRecord{
				{ID: "55555555-0000-0000-0000-000000000011", MealID: "44444444-0000-0000-0000-000000000011", FoodName: "Skinless Chicken Breast", Portion: "150g", Category: "Poultry", SubstitutionOptions: []SubstitutionOption{{Name: "Chicken Thigh", Reason: "Juicier texture"}, {Name: "Tofu in Curry", Reason: "Vegetarian swap"}}},
			},
		},
		{
			ID: "44444444-0000-0000-0000-000000000012", Title: "Tawa Spiced Fish with Mint Chutney & Salad", MealType: "Dinner",
			PhaseTarget: "Luteal", DietaryPreference: "Non-vegetarian",
			Description: "Fresh river or sea fish fillet marinated in carom seeds (ajwain), turmeric, and roasted cumin, lightly pan-seared and paired with fresh garden salad.",
			KeyNutrients: []string{"Omega-3 Fatty Acids", "Lean Protein", "Iodine", "Selenium"}, PrepTimeMin: 20,
		},
		{
			ID: "44444444-0000-0000-0000-000000000013", Title: "Egg Curry with Multigrain Bhakri", MealType: "Dinner",
			PhaseTarget: "Menstrual", DietaryPreference: "Non-vegetarian",
			Description: "Two hard-boiled eggs simmered in a spiced roasted coconut and onion gravy, served with nutrient-packed jowar-bajra bhakri.",
			KeyNutrients: []string{"Protein", "Iron", "Healthy Fats", "Minerals"}, PrepTimeMin: 25,
		},
		{
			ID: "44444444-0000-0000-0000-000000000014", Title: "Masala Boiled Eggs with Spiced Chaat Salt", MealType: "Snack",
			PhaseTarget: "Any", DietaryPreference: "Non-vegetarian",
			Description: "Two boiled eggs halved and dusted with roasted cumin and chaat masala, served with mint leaves.",
			KeyNutrients: []string{"Quick Protein", "Zero Added Sugar", "Choline"}, PrepTimeMin: 5,
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
