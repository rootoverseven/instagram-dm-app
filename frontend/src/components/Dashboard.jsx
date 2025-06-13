import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Instagram, 
  Plus, 
  MessageCircle, 
  Zap, 
  Users, 
  TrendingUp,
  Link as LinkIcon,
  Trash2
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [instagramAccounts, setInstagramAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [linkingAccount, setLinkingAccount] = useState(false);
  const [linkForm, setLinkForm] = useState({
    accessToken: '',
    instagramUserId: '',
  });

  useEffect(() => {
    fetchInstagramAccounts();
  }, []);

  const fetchInstagramAccounts = async () => {
    try {
      const response = await axios.get('/instagram/accounts');
      setInstagramAccounts(response.data.accounts);
    } catch (error) {
      console.error('Failed to fetch Instagram accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkAccount = async (e) => {
    e.preventDefault();
    setLinkingAccount(true);

    try {
      await axios.post('/instagram/link', linkForm);
      setLinkForm({ accessToken: '', instagramUserId: '' });
      fetchInstagramAccounts();
    } catch (error) {
      console.error('Failed to link Instagram account:', error);
      alert('Failed to link Instagram account. Please check your credentials.');
    } finally {
      setLinkingAccount(false);
    }
  };

  const handleUnlinkAccount = async (accountId) => {
    if (!confirm('Are you sure you want to unlink this Instagram account?')) {
      return;
    }

    try {
      await axios.delete(`/instagram/accounts/${accountId}`);
      fetchInstagramAccounts();
    } catch (error) {
      console.error('Failed to unlink Instagram account:', error);
      alert('Failed to unlink Instagram account.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.username}! Manage your Instagram accounts and automation.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Instagram className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Connected Accounts</p>
                  <p className="text-2xl font-bold text-gray-900">{instagramAccounts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Chats</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Auto DM Rules</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Messages Sent</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Instagram Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Instagram className="h-5 w-5" />
                <span>Instagram Accounts</span>
              </CardTitle>
              <CardDescription>
                Manage your connected Instagram Professional accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {instagramAccounts.length === 0 ? (
                  <div className="text-center py-8">
                    <Instagram className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No Instagram accounts connected</p>
                    <p className="text-sm text-gray-500">Connect your Instagram Professional account to get started</p>
                  </div>
                ) : (
                  instagramAccounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={account.profilePictureUrl || '/placeholder-avatar.png'}
                          alt={account.username}
                          className="h-10 w-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-900">@{account.username}</p>
                          <p className="text-sm text-gray-500">
                            Connected {new Date(account.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">Active</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnlinkAccount(account.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Link New Account */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LinkIcon className="h-5 w-5" />
                <span>Link Instagram Account</span>
              </CardTitle>
              <CardDescription>
                Connect a new Instagram Professional account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLinkAccount} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram User ID
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your Instagram User ID"
                    value={linkForm.instagramUserId}
                    onChange={(e) => setLinkForm({ ...linkForm, instagramUserId: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Token
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter your Instagram Access Token"
                    value={linkForm.accessToken}
                    onChange={(e) => setLinkForm({ ...linkForm, accessToken: e.target.value })}
                    required
                  />
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> You need an Instagram Professional account and a Facebook App to get these credentials. 
                    Visit the Facebook Developer Console to set up your app and get the required tokens.
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={linkingAccount}>
                  {linkingAccount ? 'Linking...' : 'Link Account'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <MessageCircle className="h-6 w-6" />
                  <span>View Chats</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Zap className="h-6 w-6" />
                  <span>Setup Automation</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Users className="h-6 w-6" />
                  <span>Manage Contacts</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

