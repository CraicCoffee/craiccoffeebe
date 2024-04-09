const mongoose = require('mongoose');
const fs = require('fs');
const Flavor = require('../models/Flavor'); // 确保路径正确
const path = require('path');

mongoose.connect('mongodb://localhost:27017/coffeeDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const importData = async () => {
  try {
    // 清空现有数据
    await Flavor.deleteMany({});

    // 读取文件并解析数据
    let flavorsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'flavor.json'), 'utf-8')
    );

    // 转换数据以匹配模型结构
    flavorsData = transformDataToMatchModel(flavorsData);

    // 导入数据
    await Flavor.insertMany(flavorsData);
    console.log('Data successfully imported!');

    // 这里我们输出一些验证结果
    // 输出所有导入的风味信息
    const importedFlavors = await Flavor.find({});
    console.log(`Imported Flavors:`, importedFlavors);

    // 输出第一个风味的详细信息
    const firstFlavor = await Flavor.findOne({});
    console.log(`First Flavor:`, firstFlavor);

    // 根据条件查询特定的风味信息，如大类为某一特定类型的风味
    const specificCategoryFlavors = await Flavor.find({'categories.category': '特定类型'});
    console.log(`Flavors of specific category:`, specificCategoryFlavors);

  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    // 关闭数据库连接
    mongoose.disconnect();
  }
};

const transformDataToMatchModel = (jsonData) => {
  return jsonData.map(entry => {
    // If the entry has subcategories, map them accordingly
    if (entry.subcategories) {
      return {
        categories: [
          {
            category: entry.category,
            subcategories: entry.subcategories.map(subCat => ({
              name: subCat.name,
              descriptors: subCat.descriptors.map(descriptor => ({ name: descriptor }))
            }))
          }
        ]
      };
    } else { // If the entry does not have subcategories, only map the descriptors
      return {
        categories: [
          {
            category: entry.category,
            descriptors: entry.descriptors.map(descriptor => ({ name: descriptor }))
          }
        ]
      };
    }
  });
};

importData();
