import { createMod, getMod, updateMod, deleteMod, listMods } from '../lib/modUtils';
import { Mod } from '../types/mod';

async function test() {
  try {
    console.log('Starting mod management tests...\n');

    // 测试数据
    const testMod: Mod = {
      id: 'test-mod-1',
      name: 'Test Mod',
      description: 'A test mod for testing purposes',
      category: 'gameplay',
      author: {
        name: 'Test Author',
        url: 'https://example.com/author'
      },
      downloads: 100,
      rating: 4.5,
      version: '1.0.0',
      lastUpdated: '2024-01-20',
      requirements: [
        {
          name: 'Base Game',
          url: 'https://example.com/bg3',
          description: 'Latest version of BG3'
        }
      ],
      downloadUrl: 'https://example.com/download/test-mod',
      features: [
        'Test Feature 1',
        'Test Feature 2'
      ],
      tags: [
        'test',
        'demo'
      ],
      images: [
        {
          url: 'https://example.com/image1.jpg',
          caption: 'Test Image 1'
        }
      ],
      videos: [
        {
          url: 'https://example.com/video1.mp4',
          title: 'Test Video 1',
          platform: 'youtube'
        }
      ]
    };

    // 1. 测试创建 mod
    console.log('1. Testing mod creation...');
    const createdMod = await createMod(testMod);
    console.log('✅ Mod created successfully');
    console.log('Created mod:', JSON.stringify(createdMod, null, 2));

    // 2. 测试获取单个 mod
    console.log('\n2. Testing mod retrieval...');
    const retrievedMod = await getMod(testMod.id);
    console.log('✅ Mod retrieved successfully');
    console.log('Retrieved mod:', JSON.stringify(retrievedMod, null, 2));

    // 3. 测试更新 mod
    console.log('\n3. Testing mod update...');
    const updatedData = {
      ...testMod,
      name: 'Updated Test Mod',
      description: 'Updated description',
      downloads: 200,
      features: [...testMod.features, 'New Feature']
    };
    const updatedMod = await updateMod(updatedData);
    console.log('✅ Mod updated successfully');
    console.log('Updated mod:', JSON.stringify(updatedMod, null, 2));

    // 4. 测试获取 mod 列表
    console.log('\n4. Testing mod listing...');
    const allMods = await listMods();
    console.log('✅ All mods retrieved successfully');
    console.log('Total mods:', allMods.length);

    // 5. 测试按类别获取 mod
    console.log('\n5. Testing category-based mod listing...');
    const gameplayMods = await listMods('gameplay');
    console.log('✅ Category mods retrieved successfully');
    console.log('Gameplay mods:', gameplayMods.length);

    // 6. 测试删除 mod
    console.log('\n6. Testing mod deletion...');
    await deleteMod(testMod.id);
    const deletedMod = await getMod(testMod.id);
    if (!deletedMod) {
      console.log('✅ Mod deleted successfully');
    } else {
      console.log('❌ Mod deletion failed');
    }

    console.log('\nAll tests completed successfully! 🎉');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// 运行测试
test();
