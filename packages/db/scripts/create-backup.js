
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function createBackup() {
  console.log('💾 Création de la sauvegarde de la base de données...');
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = 'backups';
  const backupFile = `backup-${timestamp}.sql`;
  
  try {
    // Créer le dossier de sauvegarde s'il n'existe pas
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }
    
    // Créer la sauvegarde avec pg_dump
    const backupPath = path.join(backupDir, backupFile);
    execSync(`pg_dump $DATABASE_URL > ${backupPath}`, { stdio: 'inherit' });
    
    console.log(`✅ Sauvegarde créée: ${backupPath}`);
    
    // Supprimer les sauvegardes anciennes (garder 30 jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const files = fs.readdirSync(backupDir);
    files.forEach(file => {
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.mtime < thirtyDaysAgo) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Sauvegarde ancienne supprimée: ${file}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error);
  }
}

createBackup();
