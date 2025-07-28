import React, { useState } from 'react';
import { Search, User, Calendar, Clock, Shield, ShieldAlert, MessageCircle, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

interface BasicInfo {
  accountId: string;
  nickname: string;
  level: number;
  lastLoginAt: string;
  createAt: string;
  headPic: number;
  rank: number;
  liked: number;
  region: string;
}

interface BanInfo {
  nickname: string;
  region: string;
  is_banned: number;
  id: string;
  period: number;
}

interface PlayerData {
  basicInfo: BasicInfo;
  banInfo: BanInfo;
  avatarUrl: string;
}

function App() {
  const [uid, setUid] = useState('');
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const convertTimestamp = (timestamp: string): string => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const searchPlayer = async () => {
    if (!uid.trim()) {
      setError('Veuillez entrer un UID valide');
      return;
    }

    setLoading(true);
    setError('');
    setPlayerData(null);

    try {
      // Récupération des infos de base
      const infoResponse = await fetch(`https://glob-info.vercel.app/info?uid=${uid}`);
      if (!infoResponse.ok) throw new Error('UID non trouvé');
      const infoData = await infoResponse.json();

      // Vérification du ban
      const banResponse = await fetch(`https://api-check-ban.vercel.app/check_ban/${uid}`);
      if (!banResponse.ok) throw new Error('Erreur lors de la vérification du ban');
      const banData = await banResponse.json();

      // Récupération de l'avatar
      const avatarResponse = await fetch(`https://genitems.vercel.app/openitems?id=${infoData.basicInfo.headPic}`);
      let avatarUrl = '';
      if (avatarResponse.ok) {
        const avatarBlob = await avatarResponse.blob();
        avatarUrl = URL.createObjectURL(avatarBlob);
      }

      setPlayerData({
        basicInfo: infoData.basicInfo,
        banInfo: banData.data,
        avatarUrl
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchPlayer();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-red-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-orange-500/20">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            🔥 UNBANNED UID FREE FIRE 🔥
          </h1>
          <p className="text-center text-gray-300 mt-2">Vérifiez le statut de votre compte Free Fire</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Entrez votre UID Free Fire..."
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
              </div>
              <button
                onClick={searchPlayer}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                {loading ? 'Recherche...' : 'Rechercher'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-300 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5" />
              {error}
            </div>
          </div>
        )}

        {/* Player Info */}
        {playerData && (
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Profile Card */}
              <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20">
                <div className="text-center mb-6">
                  {playerData.avatarUrl && (
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-orange-500/50">
                      <img 
                        src={playerData.avatarUrl} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h2 className="text-2xl font-bold text-white mb-2">{playerData.basicInfo.nickname}</h2>
                  <p className="text-gray-400">UID: {playerData.basicInfo.accountId}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <User className="w-5 h-5 text-orange-400" />
                    <span>Level: <span className="text-white font-semibold">{playerData.basicInfo.level}</span></span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-300">
                    <Shield className="w-5 h-5 text-orange-400" />
                    <span>Signature: <span className="text-white font-semibold">{playerData.socialInfo.signature}</span></span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="w-5 h-5 text-orange-400" />
                    <span>Compte créé: <span className="text-white font-semibold">{convertTimestamp(playerData.basicInfo.createAt)}</span></span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="w-5 h-5 text-orange-400" />
                    <span>Dernière connexion: <span className="text-white font-semibold">{convertTimestamp(playerData.basicInfo.lastLoginAt)}</span></span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <span>❤️</span>
                    <span>Likes: <span className="text-white font-semibold">{playerData.basicInfo.liked.toLocaleString()}</span></span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <span>🌍</span>
                    <span>Région: <span className="text-white font-semibold">{playerData.basicInfo.region}</span></span>
                  </div>
                </div>
              </div>

              {/* Ban Status Card */}
              <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20">
                <h3 className="text-xl font-bold text-white mb-6 text-center">Statut du Compte</h3>
                
                <div className="text-center">
                  {playerData.banInfo.is_banned === 0 ? (
                    <div className="space-y-4">
                      <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-green-400 mb-2">✅ COMPTE SAIN</h4>
                        <p className="text-gray-300">Votre compte n'est pas banni</p>
                        <p className="text-sm text-gray-400 mt-2">Vous pouvez jouer normalement</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                        <ShieldAlert className="w-10 h-10 text-red-400" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-red-400 mb-2">🚫 COMPTE BANNI</h4>
                        <p className="text-gray-300">Votre compte est actuellement banni</p>
                        {playerData.banInfo.period > 0 && (
                           <p className="text-sm text-gray-400 mt-2">Période: {playerData.banInfo.period} Mois</p>
                        )}
                      </div>
                      
                      <button className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all hover:scale-105 flex items-center gap-2 mx-auto">
                        <MessageCircle className="w-5 h-5" />
                        Contact Admin pour Débanner
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-700">
                  <div className="text-center text-gray-400 text-sm">
                    <p>Vérification effectuée le:</p>
                    <p className="text-white">{new Date().toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-sm border-t border-orange-500/20 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400">
          <p>&copy; 2025 UNBANNED UID FREE FIRE - Vérification de statut de compte</p>
        </div>
      </footer>
    </div>
  );
}

export default App;