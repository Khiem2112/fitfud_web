#!/usr/bin/env node

/**
 * Fidfud – Strapi v5 Content-Type Scaffolder
 *
 * Usage (run from your Strapi project root):
 *   node scaffold-strapi.js
 *
 * What it creates per content type:
 *   src/api/<name>/content-types/<name>/schema.json
 *   src/api/<name>/controllers/<name>.ts
 *   src/api/<name>/routes/<name>.ts
 *   src/api/<name>/services/<name>.ts
 *
 * Strapi v5 auto-injects these columns — NEVER declare them manually:
 *   id, documentId, created_at, updated_at, published_at,
 *   created_by_id, updated_by_id, locale
 *
 * The schemaTemplate() function strips them automatically as a safeguard.
 */

const fs   = require("fs");
const path = require("path");

const BASE = path.join(process.cwd(), "src", "api");

// Fields Strapi v5 injects automatically — must never appear in schema.json
const STRAPI_RESERVED = new Set([
  "id",
  "documentId",
  "created_at",
  "updated_at",
  "published_at",
  "created_by_id",
  "updated_by_id",
  "locale",
  "createdAt",
  "updatedAt",
  "publishedAt",
  "createdBy",
  "updatedBy",
]);

// ─── CONTENT TYPE DEFINITIONS ─────────────────────────────────────────────────

const contentTypes = [

  // ══════════════════════════════════════════════════════════════════════════
  // 1. USERS & PROFILES
  // ══════════════════════════════════════════════════════════════════════════

  {
    singularName: "user-extended",
    pluralName:   "users-extended",
    displayName:  "User",
    description:  "Core user accounts for the Fidfud platform",
    attributes: {
      full_name:    { type: "string",   required: true },
      email:        { type: "email",    required: true, unique: true },
      phone:        { type: "string",   unique: true },
      password_hash:{ type: "password", required: true },
      customer_profile: {
        type: "relation", relation: "oneToOne",
        target: "api::customer-profile.customer-profile", mappedBy: "user",
      },
      meal_logs: {
        type: "relation", relation: "oneToMany",
        target: "api::meal-log.meal-log", mappedBy: "user",
      },
      ai_recommendations: {
        type: "relation", relation: "oneToMany",
        target: "api::ai-recommendation.ai-recommendation", mappedBy: "user",
      },
      cart_items: {
        type: "relation", relation: "oneToMany",
        target: "api::cart-item.cart-item", mappedBy: "user",
      },
      orders: {
        type: "relation", relation: "oneToMany",
        target: "api::order.order", mappedBy: "user",
      },
      reviews: {
        type: "relation", relation: "oneToMany",
        target: "api::review.review", mappedBy: "user",
      },
    },
  },

  {
    singularName: "customer-profile",
    pluralName:   "customer-profiles",
    displayName:  "Customer Profile",
    description:  "Health profile and preferences for each customer",
    attributes: {
      user: {
        type: "relation", relation: "oneToOne",
        target: "api::user-extended.user-extended",
        inversedBy: "customer_profile", required: true,
      },
      gender:        { type: "enumeration", enum: ["Male", "Female", "Other"] },
      age:           { type: "integer", min: 0, max: 120 },
      height:        { type: "decimal", min: 0 },
      weight:        { type: "decimal", min: 0 },
      health_goal: {
        type: "enumeration",
        enum: ["Weight Loss", "Muscle Gain", "Eat Clean", "Calorie Control", "Convenience"],
      },
      activity_level: {
        type: "enumeration",
        enum: ["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Extra Active"],
      },
      target_calories: { type: "decimal", min: 0 },
      target_protein:  { type: "decimal", min: 0 },
      ward: {
        type: "relation", relation: "manyToOne",
        target: "api::ward.ward", inversedBy: "customer_profiles",
      },
      address_profiles: {
        type: "relation", relation: "oneToMany",
        target: "api::address-profile.address-profile", mappedBy: "customer_profile",
      },
      customer_allergies: {
        type: "relation", relation: "oneToMany",
        target: "api::customer-allergy.customer-allergy", mappedBy: "profile",
      },
    },
  },

  {
    singularName: "address-profile",
    pluralName:   "address-profiles",
    displayName:  "Address Profile",
    description:  "Saved delivery addresses for customers",
    attributes: {
      customer_profile: {
        type: "relation", relation: "manyToOne",
        target: "api::customer-profile.customer-profile",
        inversedBy: "address_profiles", required: true,
      },
      name:                 { type: "string", required: true },
      shipping_address_text:{ type: "text",   required: true },
      ward: {
        type: "relation", relation: "manyToOne",
        target: "api::ward.ward", inversedBy: "address_profiles", required: true,
      },
    },
  },

  {
    singularName: "customer-allergy",
    pluralName:   "customer-allergies",
    displayName:  "Customer Allergy",
    description:  "Allergy / ingredient restrictions per customer profile",
    attributes: {
      profile: {
        type: "relation", relation: "manyToOne",
        target: "api::customer-profile.customer-profile",
        inversedBy: "customer_allergies", required: true,
      },
      ingredient: {
        type: "relation", relation: "manyToOne",
        target: "api::ingredient.ingredient",
        inversedBy: "customer_allergies", required: true,
      },
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 2. MEAL LOGS & AI
  // ══════════════════════════════════════════════════════════════════════════

  {
    singularName: "meal-log",
    pluralName:   "meal-logs",
    displayName:  "Meal Log",
    description:  "Food diary entries with AI-detected nutritional data",
    // NOTE: created_at is auto-injected by Strapi — no need to declare it
    attributes: {
      user: {
        type: "relation", relation: "manyToOne",
        target: "api::user-extended.user-extended",
        inversedBy: "meal_logs", required: true,
      },
      image:     { type: "media", multiple: false, allowedTypes: ["images"] },
      dish_name: { type: "string" },
      calories:  { type: "decimal", min: 0 },
      protein:   { type: "decimal", min: 0 },
      carb:      { type: "decimal", min: 0 },
      fat:       { type: "decimal", min: 0 },
    },
  },

  {
    singularName: "ai-recommendation",
    pluralName:   "ai-recommendations",
    displayName:  "AI Recommendation",
    description:  "AI-generated dish recommendations per user",
    // NOTE: generated_at is a meaningful business field, NOT a system timestamp
    attributes: {
      user: {
        type: "relation", relation: "manyToOne",
        target: "api::user-extended.user-extended",
        inversedBy: "ai_recommendations", required: true,
      },
      dish_size: {
        type: "relation", relation: "manyToOne",
        target: "api::dish-size.dish-size",
        inversedBy: "ai_recommendations", required: true,
      },
      generated_at: { type: "datetime", required: true },
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 3. MENU
  // ══════════════════════════════════════════════════════════════════════════

  {
    singularName: "category",
    pluralName:   "categories",
    displayName:  "Category",
    description:  "Dish categories (e.g. Salad, Protein Bowl, Soup)",
    attributes: {
      category_name: { type: "string", required: true, unique: true },
      dishes: {
        type: "relation", relation: "oneToMany",
        target: "api::dish.dish", mappedBy: "category",
      },
    },
  },

  {
    singularName: "diet-tag",
    pluralName:   "diet-tags",
    displayName:  "Diet Tag",
    description:  "Dietary labels such as Keto, Vegan, Low-Carb",
    attributes: {
      tag_name: { type: "string", required: true, unique: true },
      dish_diet_tags: {
        type: "relation", relation: "oneToMany",
        target: "api::dish-diet-tag.dish-diet-tag", mappedBy: "diet_tag",
      },
    },
  },

  {
    singularName: "dish-diet-tag",
    pluralName:   "dish-diet-tags",
    displayName:  "Dish Diet Tag",
    description:  "Junction: links dishes to their diet tags",
    attributes: {
      dish: {
        type: "relation", relation: "manyToOne",
        target: "api::dish.dish", inversedBy: "dish_diet_tags", required: true,
      },
      diet_tag: {
        type: "relation", relation: "manyToOne",
        target: "api::diet-tag.diet-tag", inversedBy: "dish_diet_tags", required: true,
      },
    },
  },

  {
    singularName: "dish",
    pluralName:   "dishes",
    displayName:  "Dish",
    description:  "Menu items available for ordering",
    attributes: {
      category: {
        type: "relation", relation: "manyToOne",
        target: "api::category.category", inversedBy: "dishes", required: true,
      },
      dish_name:   { type: "string", required: true },
      description: { type: "text" },
      image:       { type: "media", multiple: false, allowedTypes: ["images"] },
      status: {
        type: "enumeration",
        enum: ["Active", "Inactive", "Out of Stock"],
        default: "Active", required: true,
      },
      dish_diet_tags: {
        type: "relation", relation: "oneToMany",
        target: "api::dish-diet-tag.dish-diet-tag", mappedBy: "dish",
      },
      dish_ingredients: {
        type: "relation", relation: "oneToMany",
        target: "api::dish-ingredient.dish-ingredient", mappedBy: "dish",
      },
      dish_sizes: {
        type: "relation", relation: "oneToMany",
        target: "api::dish-size.dish-size", mappedBy: "dish",
      },
    },
  },

  {
    singularName: "ingredient",
    pluralName:   "ingredients",
    displayName:  "Ingredient",
    description:  "Master list of ingredients used in dishes",
    attributes: {
      ingredient_name: { type: "string", required: true, unique: true },
      dish_ingredients: {
        type: "relation", relation: "oneToMany",
        target: "api::dish-ingredient.dish-ingredient", mappedBy: "ingredient",
      },
      customer_allergies: {
        type: "relation", relation: "oneToMany",
        target: "api::customer-allergy.customer-allergy", mappedBy: "ingredient",
      },
    },
  },

  {
    singularName: "dish-ingredient",
    pluralName:   "dish-ingredients",
    displayName:  "Dish Ingredient",
    description:  "Junction: links dishes to ingredients",
    attributes: {
      dish: {
        type: "relation", relation: "manyToOne",
        target: "api::dish.dish", inversedBy: "dish_ingredients", required: true,
      },
      ingredient: {
        type: "relation", relation: "manyToOne",
        target: "api::ingredient.ingredient", inversedBy: "dish_ingredients", required: true,
      },
    },
  },

  {
    singularName: "size",
    pluralName:   "sizes",
    displayName:  "Size",
    description:  "Portion sizes (e.g. Small, Medium, Large)",
    attributes: {
      size_name: { type: "string", required: true, unique: true },
      dish_sizes: {
        type: "relation", relation: "oneToMany",
        target: "api::dish-size.dish-size", mappedBy: "size",
      },
    },
  },

  {
    singularName: "dish-size",
    pluralName:   "dish-sizes",
    displayName:  "Dish Size",
    description:  "Pricing and nutritional info per dish per size variant",
    attributes: {
      dish: {
        type: "relation", relation: "manyToOne",
        target: "api::dish.dish", inversedBy: "dish_sizes", required: true,
      },
      size: {
        type: "relation", relation: "manyToOne",
        target: "api::size.size", inversedBy: "dish_sizes", required: true,
      },
      price:    { type: "decimal", required: true, min: 0 },
      calories: { type: "decimal", min: 0 },
      protein:  { type: "decimal", min: 0 },
      carb:     { type: "decimal", min: 0 },
      fat:      { type: "decimal", min: 0 },
      cart_items: {
        type: "relation", relation: "oneToMany",
        target: "api::cart-item.cart-item", mappedBy: "dish_size",
      },
      order_items: {
        type: "relation", relation: "oneToMany",
        target: "api::order-item.order-item", mappedBy: "dish_size",
      },
      ai_recommendations: {
        type: "relation", relation: "oneToMany",
        target: "api::ai-recommendation.ai-recommendation", mappedBy: "dish_size",
      },
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 4. CART
  // ══════════════════════════════════════════════════════════════════════════

  {
    singularName: "cart-item",
    pluralName:   "cart-items",
    displayName:  "Cart Item",
    description:  "Items currently in a user's shopping cart",
    // NOTE: created_at auto-injected by Strapi
    attributes: {
      user: {
        type: "relation", relation: "manyToOne",
        target: "api::user-extended.user-extended",
        inversedBy: "cart_items", required: true,
      },
      dish_size: {
        type: "relation", relation: "manyToOne",
        target: "api::dish-size.dish-size",
        inversedBy: "cart_items", required: true,
      },
      quantity: { type: "integer", required: true, min: 1, default: 1 },
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 5. ORDERS
  // ══════════════════════════════════════════════════════════════════════════

  {
    singularName: "order",
    pluralName:   "orders",
    displayName:  "Order",
    description:  "Customer orders with delivery and status tracking",
    // NOTE: created_at / updated_at auto-injected by Strapi
    attributes: {
      user: {
        type: "relation", relation: "manyToOne",
        target: "api::user-extended.user-extended",
        inversedBy: "orders", required: true,
      },
      order_code:   { type: "string", required: true, unique: true },
      order_status: {
        type: "enumeration",
        enum: ["Pending", "Confirmed", "Preparing", "Delivering", "Completed", "Cancelled"],
        default: "Pending", required: true,
      },
      contact_name:          { type: "string",   required: true },
      contact_phone:         { type: "string",   required: true },
      ward: {
        type: "relation", relation: "manyToOne",
        target: "api::ward.ward", inversedBy: "orders", required: true,
      },
      shipping_address:      { type: "text",     required: true },
      estimated_shipped_time:{ type: "datetime" },
      total_amount:          { type: "decimal",  required: true, min: 0 },
      order_items: {
        type: "relation", relation: "oneToMany",
        target: "api::order-item.order-item", mappedBy: "order",
      },
      payment: {
        type: "relation", relation: "oneToOne",
        target: "api::payment.payment", mappedBy: "order",
      },
      order_tracking_logs: {
        type: "relation", relation: "oneToMany",
        target: "api::order-tracking-log.order-tracking-log", mappedBy: "order",
      },
    },
  },

  {
    singularName: "order-item",
    pluralName:   "order-items",
    displayName:  "Order Item",
    description:  "Individual line items within an order",
    attributes: {
      order: {
        type: "relation", relation: "manyToOne",
        target: "api::order.order", inversedBy: "order_items", required: true,
      },
      dish_size: {
        type: "relation", relation: "manyToOne",
        target: "api::dish-size.dish-size", inversedBy: "order_items", required: true,
      },
      quantity:   { type: "integer", required: true, min: 1 },
      unit_price: { type: "decimal", required: true, min: 0 },
      subtotal:   { type: "decimal", required: true, min: 0 },
      review: {
        type: "relation", relation: "oneToOne",
        target: "api::review.review", mappedBy: "order_item",
      },
    },
  },

  {
    singularName: "payment",
    pluralName:   "payments",
    displayName:  "Payment",
    description:  "Payment records linked one-to-one with orders",
    attributes: {
      order: {
        type: "relation", relation: "oneToOne",
        target: "api::order.order", inversedBy: "payment", required: true,
      },
      payment_method: {
        type: "enumeration", enum: ["COD", "Online"], required: true,
      },
      payment_status: {
        type: "enumeration",
        enum: ["Pending", "Paid", "Failed", "Refunded"],
        default: "Pending", required: true,
      },
      // paid_at is a meaningful business timestamp, NOT a system field — safe to declare
      paid_at: { type: "datetime" },
    },
  },

  {
    singularName: "order-tracking-log",
    pluralName:   "order-tracking-logs",
    displayName:  "Order Tracking Log",
    description:  "Audit log of order status changes over time",
    // FIX: removed `updated_at` — Strapi auto-injects it, declaring it caused
    //      "duplicate column name: updated_at" SQLite error.
    // Strapi's auto-injected updated_at already tracks when each log row was written.
    attributes: {
      order: {
        type: "relation", relation: "manyToOne",
        target: "api::order.order", inversedBy: "order_tracking_logs", required: true,
      },
      status: {
        type: "enumeration",
        enum: ["Pending", "Confirmed", "Preparing", "Delivering", "Completed", "Cancelled"],
        required: true,
      },
      // Strapi's auto-injected `updated_at` covers when this row was recorded.
      // If you need an explicit business timestamp different from the row write time,
      // use a different name like `logged_at` below:
      logged_at: { type: "datetime" },
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 6. REVIEWS
  // ══════════════════════════════════════════════════════════════════════════

  {
    singularName: "review",
    pluralName:   "reviews",
    displayName:  "Review",
    description:  "Customer reviews and ratings per order item",
    // NOTE: created_at auto-injected by Strapi
    attributes: {
      user: {
        type: "relation", relation: "manyToOne",
        target: "api::user-extended.user-extended",
        inversedBy: "reviews", required: true,
      },
      order_item: {
        type: "relation", relation: "oneToOne",
        target: "api::order-item.order-item", inversedBy: "review", required: true,
      },
      rating:  { type: "integer", required: true, min: 1, max: 5 },
      comment: { type: "text" },
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 7. GEOGRAPHY
  // ══════════════════════════════════════════════════════════════════════════

  {
    singularName: "city",
    pluralName:   "cities",
    displayName:  "City",
    description:  "Top-level geographic unit (province / city)",
    attributes: {
      name: { type: "string", required: true, unique: true },
      districts: {
        type: "relation", relation: "oneToMany",
        target: "api::district.district", mappedBy: "city",
      },
    },
  },

  {
    singularName: "district",
    pluralName:   "districts",
    displayName:  "District",
    description:  "Administrative districts within a city",
    attributes: {
      city: {
        type: "relation", relation: "manyToOne",
        target: "api::city.city", inversedBy: "districts", required: true,
      },
      name: { type: "string", required: true },
      wards: {
        type: "relation", relation: "oneToMany",
        target: "api::ward.ward", mappedBy: "district",
      },
    },
  },

  {
    singularName: "ward",
    pluralName:   "wards",
    displayName:  "Ward",
    description:  "Sub-district wards used for delivery address resolution",
    attributes: {
      district: {
        type: "relation", relation: "manyToOne",
        target: "api::district.district", inversedBy: "wards", required: true,
      },
      name: { type: "string", required: true },
      customer_profiles: {
        type: "relation", relation: "oneToMany",
        target: "api::customer-profile.customer-profile", mappedBy: "ward",
      },
      address_profiles: {
        type: "relation", relation: "oneToMany",
        target: "api::address-profile.address-profile", mappedBy: "ward",
      },
      orders: {
        type: "relation", relation: "oneToMany",
        target: "api::order.order", mappedBy: "ward",
      },
    },
  },
];

// ─── BOILERPLATE TEMPLATES ────────────────────────────────────────────────────

function controllerTemplate(name) {
  return `import { factories } from '@strapi/strapi';\n\nexport default factories.createCoreController('api::${name}.${name}');\n`;
}

function routeTemplate(name) {
  return `import { factories } from '@strapi/strapi';\n\nexport default factories.createCoreRouter('api::${name}.${name}');\n`;
}

function serviceTemplate(name) {
  return `import { factories } from '@strapi/strapi';\n\nexport default factories.createCoreService('api::${name}.${name}');\n`;
}

/**
 * Builds the per-model schema.json.
 * Strips any reserved Strapi v5 auto-injected fields before writing,
 * so manually declared timestamps never cause duplicate-column errors.
 */
function schemaTemplate(ct) {
  const safeAttributes = Object.fromEntries(
    Object.entries(ct.attributes).filter(([key]) => {
      if (STRAPI_RESERVED.has(key)) {
        console.warn(`  ⚠  [${ct.singularName}] Stripped reserved field "${key}" (auto-injected by Strapi)`);
        return false;
      }
      return true;
    })
  );

  const schema = {
    kind: "collectionType",
    collectionName: ct.pluralName.replace(/-/g, "_"),
    info: {
      singularName: ct.singularName,
      pluralName:   ct.pluralName,
      displayName:  ct.displayName,
      description:  ct.description || "",
    },
    options: {
      draftAndPublish: false,   // set true if you need draft/publish workflow
    },
    pluginOptions: {},
    attributes: safeAttributes,
  };

  return JSON.stringify(schema, null, 2);
}

// ─── SCAFFOLD ─────────────────────────────────────────────────────────────────

function mkdirp(dir) { fs.mkdirSync(dir, { recursive: true }); }
function write(filePath, content) { fs.writeFileSync(filePath, content, "utf8"); }

let created = 0;
let skipped = 0;
let warned  = 0;

console.log("\n🚀  Fidfud Strapi v5 Scaffolder\n");

for (const ct of contentTypes) {
  const name   = ct.singularName;
  const apiDir = path.join(BASE, name);

  console.log(`📦  ${ct.displayName} (${name})`);

  mkdirp(path.join(apiDir, "content-types", name));
  mkdirp(path.join(apiDir, "controllers"));
  mkdirp(path.join(apiDir, "routes"));
  mkdirp(path.join(apiDir, "services"));

  const files = [
    [path.join(apiDir, "content-types", name, "schema.json"), schemaTemplate(ct)],
    [path.join(apiDir, "controllers", `${name}.ts`),          controllerTemplate(name)],
    [path.join(apiDir, "routes",      `${name}.ts`),          routeTemplate(name)],
    [path.join(apiDir, "services",    `${name}.ts`),          serviceTemplate(name)],
  ];

  for (const [filePath, content] of files) {
    const rel = path.relative(process.cwd(), filePath);
    if (fs.existsSync(filePath)) {
      console.log(`  ⚠  SKIP (exists): ${rel}`);
      skipped++;
    } else {
      write(filePath, content);
      console.log(`  ✓  ${rel}`);
      created++;
    }
  }
}

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  Done!
   ${created} files created
   ${skipped} files skipped (already existed)

📌  Strapi v5 auto-injects these — never declare them:
   id · documentId · created_at · updated_at
   published_at · created_by_id · updated_by_id · locale

🔧  Next steps:
   1.  yarn develop
   2.  http://localhost:1337/admin
   3.  All 23 content types will be in Content-Type Builder
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
