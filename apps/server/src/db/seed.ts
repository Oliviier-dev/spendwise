import { db } from "@/db";
import { categories } from "./schema/categories";
import { eq } from "drizzle-orm";

interface DefaultCategory {
  name: string;
  type: "income" | "expense";
  isDefault: boolean;
}

const defaultCategories: DefaultCategory[] = [
  // Expense Categories
  { name: "Food & Dining", type: "expense", isDefault: true },
  { name: "Transportation", type: "expense", isDefault: true },
  { name: "Housing", type: "expense", isDefault: true },
  { name: "Utilities", type: "expense", isDefault: true },
  { name: "Entertainment", type: "expense", isDefault: true },
  { name: "Healthcare", type: "expense", isDefault: true },
  { name: "Miscellaneous", type: "expense", isDefault: true },

  // Income Categories
  { name: "Salary", type: "income", isDefault: true },
  { name: "Freelance", type: "income", isDefault: true },
  { name: "Investments", type: "income", isDefault: true },
  { name: "Other Income", type: "income", isDefault: true },
];

export async function seedDefaultCategories() {
  try {
    const existingDefaults = await db
      .select()
      .from(categories)
      .where(eq(categories.isDefault, true));

    if (existingDefaults.length === 0) {
      const now = new Date();
      const categoriesWithTimestamps = defaultCategories.map((cat) => ({
        ...cat,
        createdAt: now,
        updatedAt: now,
      }));
      
      await db.insert(categories).values(categoriesWithTimestamps).returning();
      return { success: true, message: "Default categories seeded successfully" };
    }

    // If categories exist, verify they match our default categories
    const existingNames = new Set(existingDefaults.map(cat => cat.name));
    const missingCategories = defaultCategories.filter(cat => !existingNames.has(cat.name));

    if (missingCategories.length > 0) {
      const now = new Date();
      const categoriesWithTimestamps = missingCategories.map((cat) => ({
        ...cat,
        createdAt: now,
        updatedAt: now,
      }));
      
      await db.insert(categories).values(categoriesWithTimestamps).returning();
      return { 
        success: true, 
        message: `Added ${missingCategories.length} missing default categories` 
      };
    }

    return { 
      success: true, 
      message: "All default categories already exist" 
    };
  } catch (error) {
    return { 
      success: false, 
      message: "Error seeding default categories", 
      error 
    };
  }
}

// Execute the seeding function
seedDefaultCategories()
  .then((result) => {
    if (!result.success) {
      console.error(result.message, result.error);
      process.exit(1);
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  }); 