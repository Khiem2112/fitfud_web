import React from 'react';
import { mockMasterData } from '../../../service/menuService';

export default function ProfileSummaryChipGroup({ profile }) {
  if (!profile) return null;

  const allergyNames = (profile.allergyIds || []).map(id => {
    const allergy = mockMasterData.allergies.find(a => a.id === id);
    return allergy ? allergy.name : id;
  });

  return (
    <div className="flex flex-wrap gap-2 mt-4 items-center">
      <span className="text-xs font-bold text-text-muted mr-2">Hồ sơ của bạn:</span>
      
      <div className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold">
        <span>🎯</span> {profile.healthGoal}
      </div>

      <div className="flex items-center gap-1 bg-accent/10 text-accent-dark border border-accent/20 px-3 py-1 rounded-full text-xs font-semibold">
        <span>🔥</span> {profile.targetCalories} kcal
      </div>

      <div className="flex items-center gap-1 bg-blue-500/10 text-blue-600 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold">
        <span>💪</span> {profile.targetProtein}g Protein
      </div>

      {allergyNames.length > 0 && (
        <div className="flex items-center gap-1 bg-red-500/10 text-red-600 border border-red-500/20 px-3 py-1 rounded-full text-xs font-semibold">
          <span>⚠️</span> Dị ứng: {allergyNames.join(', ')}
        </div>
      )}
    </div>
  );
}
