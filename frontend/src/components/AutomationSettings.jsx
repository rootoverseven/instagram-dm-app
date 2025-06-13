import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Zap, 
  Plus, 
  Edit, 
  Trash2, 
  MessageCircle, 
  Hash,
  Clock,
  Target
} from 'lucide-react';

const AutomationSettings = () => {
  const [rules, setRules] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [newRule, setNewRule] = useState({
    triggerType: 'comment_on_reel',
    triggerKeywords: '',
    dmMessage: '',
    isActive: true
  });

  // Mock data for demonstration
  useEffect(() => {
    setRules([
      {
        id: 1,
        triggerType: 'comment_on_reel',
        triggerKeywords: ['interested', 'info', 'details'],
        dmMessage: 'Hi! Thanks for your interest. I\'ll send you more details shortly.',
        isActive: true,
        createdAt: '2024-01-15',
        triggeredCount: 23
      },
      {
        id: 2,
        triggerType: 'comment_on_reel',
        triggerKeywords: ['price', 'cost', 'how much'],
        dmMessage: 'Hello! I\'ll send you pricing information right away.',
        isActive: false,
        createdAt: '2024-01-10',
        triggeredCount: 15
      }
    ]);
  }, []);

  const handleCreateRule = (e) => {
    e.preventDefault();
    const rule = {
      id: rules.length + 1,
      ...newRule,
      triggerKeywords: newRule.triggerKeywords.split(',').map(k => k.trim()).filter(k => k),
      createdAt: new Date().toISOString().split('T')[0],
      triggeredCount: 0
    };
    setRules([...rules, rule]);
    setNewRule({
      triggerType: 'comment_on_reel',
      triggerKeywords: '',
      dmMessage: '',
      isActive: true
    });
    setShowCreateForm(false);
  };

  const handleEditRule = (rule) => {
    setEditingRule(rule);
    setNewRule({
      ...rule,
      triggerKeywords: rule.triggerKeywords.join(', ')
    });
    setShowCreateForm(true);
  };

  const handleUpdateRule = (e) => {
    e.preventDefault();
    const updatedRule = {
      ...editingRule,
      ...newRule,
      triggerKeywords: newRule.triggerKeywords.split(',').map(k => k.trim()).filter(k => k)
    };
    setRules(rules.map(rule => rule.id === editingRule.id ? updatedRule : rule));
    setEditingRule(null);
    setNewRule({
      triggerType: 'comment_on_reel',
      triggerKeywords: '',
      dmMessage: '',
      isActive: true
    });
    setShowCreateForm(false);
  };

  const handleDeleteRule = (ruleId) => {
    if (confirm('Are you sure you want to delete this automation rule?')) {
      setRules(rules.filter(rule => rule.id !== ruleId));
    }
  };

  const toggleRuleStatus = (ruleId) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Automation Settings</h1>
              <p className="text-gray-600 mt-2">Set up automated DM responses for Instagram comments</p>
            </div>
            <Button onClick={() => setShowCreateForm(true)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Rule</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Rules</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {rules.filter(rule => rule.isActive).length}
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">Messages Sent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {rules.reduce((total, rule) => total + rule.triggeredCount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Rules</p>
                  <p className="text-2xl font-bold text-gray-900">{rules.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rules List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Automation Rules</CardTitle>
                <CardDescription>
                  Manage your automated DM responses for Instagram comments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {rules.length === 0 ? (
                  <div className="text-center py-8">
                    <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No automation rules created</p>
                    <p className="text-sm text-gray-500">Create your first rule to start automating DMs</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rules.map((rule) => (
                      <div key={rule.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant={rule.isActive ? "default" : "secondary"}>
                                {rule.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              <Badge variant="outline">
                                {rule.triggerType.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-900 mb-1">Trigger Keywords:</p>
                              <div className="flex flex-wrap gap-1">
                                {rule.triggerKeywords.map((keyword, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    <Hash className="h-3 w-3 mr-1" />
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-900 mb-1">Auto DM Message:</p>
                              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                {rule.dmMessage}
                              </p>
                            </div>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Created {rule.createdAt}
                              </span>
                              <span className="flex items-center">
                                <MessageCircle className="h-3 w-3 mr-1" />
                                {rule.triggeredCount} messages sent
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Switch
                              checked={rule.isActive}
                              onCheckedChange={() => toggleRuleStatus(rule.id)}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditRule(rule)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteRule(rule.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Create/Edit Rule Form */}
          {showCreateForm && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingRule ? 'Edit Rule' : 'Create New Rule'}
                  </CardTitle>
                  <CardDescription>
                    Set up automated DM responses for specific comment triggers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={editingRule ? handleUpdateRule : handleCreateRule} className="space-y-4">
                    <div>
                      <Label htmlFor="triggerKeywords">Trigger Keywords</Label>
                      <Input
                        id="triggerKeywords"
                        placeholder="interested, info, details"
                        value={newRule.triggerKeywords}
                        onChange={(e) => setNewRule({ ...newRule, triggerKeywords: e.target.value })}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Separate keywords with commas. DM will be sent when any of these words appear in comments.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="dmMessage">Auto DM Message</Label>
                      <Textarea
                        id="dmMessage"
                        placeholder="Hi! Thanks for your interest. I'll send you more details shortly."
                        value={newRule.dmMessage}
                        onChange={(e) => setNewRule({ ...newRule, dmMessage: e.target.value })}
                        rows={4}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        This message will be automatically sent as a DM to users who comment with the trigger keywords.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={newRule.isActive}
                        onCheckedChange={(checked) => setNewRule({ ...newRule, isActive: checked })}
                      />
                      <Label htmlFor="isActive">Active</Label>
                    </div>

                    <div className="flex space-x-2">
                      <Button type="submit" className="flex-1">
                        {editingRule ? 'Update Rule' : 'Create Rule'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowCreateForm(false);
                          setEditingRule(null);
                          setNewRule({
                            triggerType: 'comment_on_reel',
                            triggerKeywords: '',
                            dmMessage: '',
                            isActive: true
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutomationSettings;

