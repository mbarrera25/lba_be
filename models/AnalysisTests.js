const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

    const AnalysisTest = sequelize.define('analysis_test', {
      AnalysisId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'analysis',
          key: 'id',
        },
        primaryKey: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      TestId: {
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
