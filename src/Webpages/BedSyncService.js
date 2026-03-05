// BedSyncService.js - Place in your utils folder
import axios from 'axios';

class BedSyncService {
  constructor() {
    this.bedsApi = 'http://localhost:8005/api/beds';
    this.admissionsApi = 'http://localhost:8001/api/admitpatient';
  }

  // Force sync all beds with admissions
  async forceSyncAll() {
    try {
      // Get all beds
      const bedsRes = await axios.get(this.bedsApi);
      const beds = bedsRes.data.data || bedsRes.data;
      
      // Get all admitted patients
      const admissionsRes = await axios.get(this.admissionsApi);
      const admissions = admissionsRes.data.data || [];
      const admittedPatients = admissions.filter(a => a.status === 'Admitted');
      
      let updatedCount = 0;
      
      // Update each bed if needed
      for (const bed of beds) {
        const isOccupied = admittedPatients.some(p => p.bedNo === bed.bedNumber);
        const correctStatus = isOccupied ? 'Occupied' : 'Available';
        
        if (bed.status !== correctStatus && bed.status !== 'Maintenance' && bed.status !== 'Reserved') {
          await axios.put(`${this.bedsApi}/${bed._id}`, {
            bedNumber: bed.bedNumber,
            status: correctStatus
          });
          updatedCount++;
        }
      }
      
      return { success: true, updatedCount };
    } catch (error) {
      console.error('Sync failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Sync a single bed
  async syncBed(bedNumber, shouldBeOccupied) {
    try {
      const bedsRes = await axios.get(this.bedsApi);
      const beds = bedsRes.data.data || bedsRes.data;
      const bed = beds.find(b => b.bedNumber === bedNumber);
      
      if (bed) {
        const newStatus = shouldBeOccupied ? 'Occupied' : 'Available';
        if (bed.status !== newStatus) {
          await axios.put(`${this.bedsApi}/${bed._id}`, {
            bedNumber: bed.bedNumber,
            status: newStatus
          });
          return { success: true, bedNumber, oldStatus: bed.status, newStatus };
        }
      }
      return { success: true, message: 'No update needed' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new BedSyncService();