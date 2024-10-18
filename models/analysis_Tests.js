const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

    const AnalysisTest = sequelize.define('analysis_test', {
      analysis_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'analysis',
          key: 'id',
        },
        primaryKey: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      test_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'test',
          key: 'id',
        },
        primaryKey: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },{
        tableName: 'analysis_test'
    });
  
    module.exports = AnalysisTest;
