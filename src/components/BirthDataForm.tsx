
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import type { BirthData } from '../pages/Index';

interface BirthDataFormProps {
  onSubmit: (data: BirthData) => void;
}

const BirthDataForm = ({ onSubmit }: BirthDataFormProps) => {
  const [formData, setFormData] = useState<BirthData>({
    fullName: '',
    birthDate: '',
    birthTime: '',
    birthCity: '',
    birthCountry: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(formData).every(value => value.trim() !== '')) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof BirthData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/30 shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-purple-200 mb-2">
              🌟 Astral Bilgilerini Gir
            </h2>
            <p className="text-gray-400">
              Yıldızların sana özgü mesajını almak için doğum bilgilerini paylaş
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-purple-200 font-medium">
                ✨ Tam Adın
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={handleChange('fullName')}
                placeholder="Adın ve soyadın"
                className="bg-slate-700/50 border-purple-400/30 text-white placeholder-gray-400 focus:border-purple-400"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-purple-200 font-medium">
                  🗓️ Doğum Tarihi
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange('birthDate')}
                  className="bg-slate-700/50 border-purple-400/30 text-white focus:border-purple-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthTime" className="text-purple-200 font-medium">
                  🕐 Doğum Saati
                </Label>
                <Input
                  id="birthTime"
                  type="time"
                  value={formData.birthTime}
                  onChange={handleChange('birthTime')}
                  className="bg-slate-700/50 border-purple-400/30 text-white focus:border-purple-400"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthCity" className="text-purple-200 font-medium">
                  🏙️ Doğum Şehri
                </Label>
                <Input
                  id="birthCity"
                  value={formData.birthCity}
                  onChange={handleChange('birthCity')}
                  placeholder="İstanbul"
                  className="bg-slate-700/50 border-purple-400/30 text-white placeholder-gray-400 focus:border-purple-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthCountry" className="text-purple-200 font-medium">
                  🌍 Doğum Ülkesi
                </Label>
                <Input
                  id="birthCountry"
                  value={formData.birthCountry}
                  onChange={handleChange('birthCountry')}
                  placeholder="Türkiye"
                  className="bg-slate-700/50 border-purple-400/30 text-white placeholder-gray-400 focus:border-purple-400"
                  required
                />
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 text-lg shadow-lg"
              >
                🔮 Astrolojik Analizi Başlat
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BirthDataForm;
