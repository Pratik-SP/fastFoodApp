import { ID } from 'appwrite';
import { databases, storage } from './appwrite';

import dummyData from './data';
import { appwriteConfig } from './appwriteConfig';

interface Category {
  name: string;
  description: string;
}

interface Customization {
  name: string;
  price: number;
  type: 'topping' | 'side' | 'size' | 'crust' | string; // extend as needed
}

interface MenuItem {
  name: string;
  description: string;
  image_url: string;
  price: number;
  rating: number;
  calories: number;
  protein: number;
  category_name: string;
  customizations: string[]; // list of customization names
}

interface DummyData {
  categories: Category[];
  customizations: Customization[];
  menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
  try {
    const list = await databases.listDocuments(
      appwriteConfig.databaseId,
      collectionId,
    );

    if (list.documents && list.documents?.length > 0) {
      await Promise.all(
        list.documents.map(doc =>
          databases.deleteDocument(
            appwriteConfig.databaseId,
            collectionId,
            doc.$id,
          ),
        ),
      );
    }

    console.log(
      `✅ Cleaned ${list.documents?.length || 0} documents from ${collectionId}`,
    );
  } catch (error) {
    console.log(`⚠️ Error cleaning collection ${collectionId}:`, error);
  }
}

async function clearStorage(): Promise<void> {
  try {
    const list = await storage.listFiles(appwriteConfig.appwriteBucketId);

    if (list.files && list.files.length > 0) {
      await Promise.all(
        list.files.map(file =>
          storage.deleteFile(appwriteConfig.appwriteBucketId, file.$id),
        ),
      );
    }

    console.log(`✅ Cleaned ${list.files.length || 0} files from storage`);
  } catch (error) {
    console.log('⚠️ Error cleaning storage:', error);
  }
}

// async function uploadImageToStorage(imageUrl: string) {
//   const response = await fetch(imageUrl);

//   const blob = await response.blob();

//   const fileName = imageUrl.split('/').pop() || `file-${Date.now()}.jpg`;

//   // Always create a File from the Blob to satisfy the type requirement
//   const file = new File([blob], fileName, { type: blob.type });

//   const uploadedFile = await storage.createFile(
//     appwriteConfig.appwriteBucketId,
//     ID.unique(),
//     file,
//   );

//   return storage.getFileView(appwriteConfig.appwriteBucketId, uploadedFile.$id);
// }

async function seed(): Promise<void> {
  try {
    console.log('🌱 Starting database seeding...');

    //Debug all config values
    console.log('🔍 Debugging config Values: ');
    console.log('DatabaseID: ', appwriteConfig.databaseId);
    console.log(
      'categoriesCollectionId: ',
      appwriteConfig.categoriesCollectionId,
    );
    console.log(
      'customizationsCollectionId: ',
      appwriteConfig.customizationsCollectionId,
    );
    console.log('menuCollectionId: ', appwriteConfig.menuCollectionId);
    console.log(
      'menuCustomizationsCollectionId: ',
      appwriteConfig.menuCustomizationsCollectionId,
    );
    console.log('appwriteBucketId: ', appwriteConfig.appwriteBucketId);

    // 1. Clear all
    console.log('🧹 Clearing existing data... ');
    await clearAll(appwriteConfig.categoriesCollectionId);
    await clearAll(appwriteConfig.customizationsCollectionId);
    await clearAll(appwriteConfig.menuCollectionId);
    await clearAll(appwriteConfig.menuCustomizationsCollectionId);
    await clearStorage();

    // 2. Create Categories
    console.log('📁 Creating categories... ');
    const categoryMap: Record<string, string> = {};
    for (const cat of data.categories) {
      const doc = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.categoriesCollectionId,
        ID.unique(),
        cat,
      );
      categoryMap[cat.name] = doc.$id;
    }
    console.log(`✅ Created ${data.categories.length} categories`);

    // 3. Create Customizations
    console.log('🎨 Creating customizations... ');
    const customizationMap: Record<string, string> = {};
    for (const cus of data.customizations) {
      const doc = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.customizationsCollectionId,
        ID.unique(),
        {
          name: cus.name,
          price: cus.price,
          type: cus.type,
        },
      );
      customizationMap[cus.name] = doc.$id;
    }
    console.log(`✅ Created ${data.customizations.length} customizations`);

    // 4. Create Menu Items
    console.log('🍕 Creating menu items... ');
    const menuMap: Record<string, string> = {};
    for (const item of data.menu) {
      try {
        // console.log(`📸 Uploading image for ${item.name}... `);
        // const uploadedImage = await uploadImageToStorage(item.image_url);

        const doc = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.menuCollectionId,
          ID.unique(),
          {
            name: item.name,
            description: item.description,
            image_url: item.image_url,
            price: item.price,
            rating: item.rating,
            calories: item.calories,
            protein: item.protein,
            categories: categoryMap[item.category_name],
          },
        );

        menuMap[item.name] = doc.$id;

        // 5. Create menu_customizations
        for (const cusName of item.customizations) {
          await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.menuCustomizationsCollectionId,
            ID.unique(),
            {
              menu: doc.$id,
              customizations: customizationMap[cusName],
            },
          );
        }
        console.log(`✅ Created menu item: ${item.name}`);
      } catch (error) {
        console.log(`❌ Failed to create menu item ${item.name}: `, error);
      }
    }
    console.log(`✅ Created ${data.menu.length} menu items`);

    console.log('✅ Seeding complete.');
  } catch (error) {
    console.error('❌ Seeding Failed!: ', error);
  }
}

export default seed;
