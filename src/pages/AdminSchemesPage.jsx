import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { adminService } from '../services/adminService';
import { schemeService } from '../services/schemeService';
import { INDIAN_STATES, OCCUPATIONS, SCHEME_CATEGORIES } from '../components/schemes/SchemeFilter';
import {
  FilePlus2,
  Edit,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  Search,
  ExternalLink,
  CheckCircle2,
  X,
  AlertCircle,
  Loader2,
  Plus,
} from 'lucide-react';

const AdminSchemesPage = () => {
  const { t } = useTranslation();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [formSaving, setFormSaving] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    schemeName: '',
    schemeCode: '',
    category: 'Agriculture',
    governmentLevel: 'CENTRAL',
    department: '',
    shortDescription: '',
    detailedDescription: '',
    benefits: '',
    applicationProcess: '',
    officialUrl: '',
    verificationStatus: 'VERIFIED',
    publicationStatus: 'PUBLISHED',
    informationSource: 'Official Ministry Website',
    eligibilityRule: {
      minimumAge: 18,
      maximumAge: 100,
      minimumIncome: 0,
      maximumIncome: 1000000,
      eligibleStates: 'ALL',
      eligibleOccupations: 'ALL',
      eligibleSocialCategories: 'ALL',
      eligibleEducationLevels: 'ALL',
      additionalConditions: '',
    },
    documents: [
      { documentName: 'Aadhaar Card', description: 'Identity verification', mandatoryStatus: true },
    ],
  });

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const data = await schemeService.getSchemes({ size: 100 });
      setSchemes(data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const openAddModal = () => {
    setEditingScheme(null);
    setFormData({
      schemeName: '',
      schemeCode: '',
      category: 'Agriculture',
      governmentLevel: 'CENTRAL',
      department: '',
      shortDescription: '',
      detailedDescription: '',
      benefits: '',
      applicationProcess: '',
      officialUrl: '',
      verificationStatus: 'VERIFIED',
      publicationStatus: 'PUBLISHED',
      informationSource: 'Official Ministry Website',
      eligibilityRule: {
        minimumAge: 18,
        maximumAge: 100,
        minimumIncome: 0,
        maximumIncome: 1000000,
        eligibleStates: 'ALL',
        eligibleOccupations: 'ALL',
        eligibleSocialCategories: 'ALL',
        eligibleEducationLevels: 'ALL',
        additionalConditions: '',
      },
      documents: [
        { documentName: 'Aadhaar Card', description: 'Identity verification', mandatoryStatus: true },
      ],
    });
    setModalOpen(true);
  };

  const openEditModal = (scheme) => {
    setEditingScheme(scheme);
    setFormData({
      schemeName: scheme.schemeName,
      schemeCode: scheme.schemeCode,
      category: scheme.category,
      governmentLevel: scheme.governmentLevel,
      department: scheme.department,
      shortDescription: scheme.shortDescription,
      detailedDescription: scheme.detailedDescription,
      benefits: scheme.benefits,
      applicationProcess: scheme.applicationProcess,
      officialUrl: scheme.officialUrl,
      verificationStatus: scheme.verificationStatus,
      publicationStatus: scheme.publicationStatus,
      informationSource: scheme.informationSource,
      eligibilityRule: scheme.eligibilityRule || {
        minimumAge: 0,
        maximumAge: 120,
        minimumIncome: 0,
        maximumIncome: null,
        eligibleStates: 'ALL',
        eligibleOccupations: 'ALL',
        eligibleSocialCategories: 'ALL',
        eligibleEducationLevels: 'ALL',
        additionalConditions: '',
      },
      documents: scheme.documents || [],
    });
    setModalOpen(true);
  };

  const handleToggleVerification = async (scheme) => {
    const newStatus = scheme.verificationStatus === 'VERIFIED' ? 'UNVERIFIED' : 'VERIFIED';
    try {
      await adminService.updateVerification(scheme.id, newStatus);
      setSchemes((prev) =>
        prev.map((s) => (s.id === scheme.id ? { ...s, verificationStatus: newStatus } : s))
      );
      setMessage(`Verification updated to ${newStatus}.`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to update verification status.');
    }
  };

  const handleDelete = async (scheme) => {
    const confirm = window.confirm(
      `Are you sure you want to permanently delete scheme "${scheme.schemeName}"?`
    );
    if (!confirm) return;

    try {
      await adminService.deleteScheme(scheme.id);
      setSchemes((prev) => prev.filter((s) => s.id !== scheme.id));
      setMessage('Scheme successfully deleted.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to delete scheme.');
    }
  };

  const handleSaveSchemeForm = async (e) => {
    e.preventDefault();
    setFormSaving(true);
    setError('');

    try {
      if (editingScheme) {
        const updated = await adminService.updateScheme(editingScheme.id, formData);
        setSchemes((prev) => prev.map((s) => (s.id === editingScheme.id ? updated : s)));
        setMessage('Scheme updated successfully.');
      } else {
        const created = await adminService.createScheme(formData);
        setSchemes((prev) => [created, ...prev]);
        setMessage('Scheme created successfully.');
      }
      setModalOpen(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save scheme. Please check inputs.');
    } finally {
      setFormSaving(false);
    }
  };

  const filteredSchemes = schemes.filter((s) =>
    s.schemeName.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/dashboard"
            className="text-xs font-bold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {t('admin.manageSchemes')}
          </h1>
          <p className="text-slate-500 text-sm">
            Maintain verified government welfare initiatives, rules, and official links.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-3 bg-gov-teal hover:bg-teal-700 text-white font-bold rounded-xl text-sm inline-flex items-center gap-2 shadow-xs transition-colors"
        >
          <FilePlus2 className="w-4 h-4" />
          {t('admin.addScheme')}
        </button>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl flex items-center gap-3 text-sm text-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Search Input Bar */}
      <div className="card-gov p-4 flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search schemes by name, department, or category..."
          className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Schemes Table */}
      <div className="card-gov overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">Scheme Name</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Level</th>
                <th className="py-4 px-6">Verification</th>
                <th className="py-4 px-6">Last Verified</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin text-gov-teal mx-auto mb-2" />
                    Loading schemes directory...
                  </td>
                </tr>
              ) : filteredSchemes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    No schemes found matching search.
                  </td>
                </tr>
              ) : (
                filteredSchemes.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 line-clamp-1">
                        {s.schemeName}
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        {s.schemeCode}
                      </span>
                    </td>
                    <td className="py-4 px-6">{s.category}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          s.governmentLevel === 'CENTRAL'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {s.governmentLevel}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleVerification(s)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                          s.verificationStatus === 'VERIFIED'
                            ? 'bg-teal-100 text-teal-800 hover:bg-teal-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                        title="Click to toggle verification status"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {s.verificationStatus}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {s.lastVerifiedAt}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1.5 text-slate-500 hover:text-gov-teal hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Scheme"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Scheme"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Scheme Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">
                {editingScheme ? 'Edit Government Scheme' : 'Add New Government Scheme'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSaveSchemeForm} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Scheme Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.schemeName}
                    onChange={(e) => setFormData({ ...formData, schemeName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Scheme Code (Unique) *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingScheme}
                    value={formData.schemeCode}
                    onChange={(e) => setFormData({ ...formData, schemeCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    {SCHEME_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Government Level *
                  </label>
                  <select
                    value={formData.governmentLevel}
                    onChange={(e) => setFormData({ ...formData, governmentLevel: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="CENTRAL">CENTRAL</option>
                    <option value="STATE">STATE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Governing Ministry / Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Verified Official Application URL (.gov.in / .nic.in) *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.officialUrl}
                    onChange={(e) => setFormData({ ...formData, officialUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Short Description *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Benefits *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Detailed Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.detailedDescription}
                    onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Step-by-Step Application Process *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.applicationProcess}
                    onChange={(e) => setFormData({ ...formData, applicationProcess: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Eligibility Rules Section */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-sm font-bold text-slate-900">
                  Eligibility Evaluation Rules
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block font-bold mb-1">Min Age</label>
                    <input
                      type="number"
                      value={formData.eligibilityRule.minimumAge}
                      onChange={(e) => setFormData({
                        ...formData,
                        eligibilityRule: { ...formData.eligibilityRule, minimumAge: parseInt(e.target.value, 10) }
                      })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Max Age</label>
                    <input
                      type="number"
                      value={formData.eligibilityRule.maximumAge}
                      onChange={(e) => setFormData({
                        ...formData,
                        eligibilityRule: { ...formData.eligibilityRule, maximumAge: parseInt(e.target.value, 10) }
                      })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block font-bold mb-1">Max Annual Income (₹)</label>
                    <input
                      type="number"
                      value={formData.eligibilityRule.maximumIncome || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        eligibilityRule: { ...formData.eligibilityRule, maximumIncome: parseFloat(e.target.value) }
                      })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-4">
                    <label className="block font-bold mb-1">Eligible States (e.g. ALL or comma-separated)</label>
                    <input
                      type="text"
                      value={formData.eligibilityRule.eligibleStates}
                      onChange={(e) => setFormData({
                        ...formData,
                        eligibilityRule: { ...formData.eligibilityRule, eligibleStates: e.target.value }
                      })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-4">
                    <label className="block font-bold mb-1">Target Occupations (e.g. Farmer, Agricultural labourer or ALL)</label>
                    <input
                      type="text"
                      value={formData.eligibilityRule.eligibleOccupations}
                      onChange={(e) => setFormData({
                        ...formData,
                        eligibilityRule: { ...formData.eligibilityRule, eligibleOccupations: e.target.value }
                      })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSaving}
                  className="px-6 py-2.5 bg-gov-teal hover:bg-teal-700 text-white font-bold rounded-xl text-sm shadow-xs disabled:opacity-50"
                >
                  {formSaving ? 'Saving...' : editingScheme ? 'Update Scheme' : 'Create Scheme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSchemesPage;
