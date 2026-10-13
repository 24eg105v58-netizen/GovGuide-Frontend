import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { adminService } from '../services/adminService';
import {
  Users,
  Layers,
  ShieldCheck,
  Building2,
  FilePlus2,
  Activity,
  ArrowRight,
  Loader2,
  AlertTriangle,
  History,
} from 'lucide-react';

const AdminDashboardPage = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [statsData, logsData] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getAuditLogs({ size: 8 }),
        ]);
        setStats(statsData);
        setAuditLogs(logsData.content || []);
      } catch (err) {
        console.error('Error loading admin dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-12 h-12 text-gov-navy animate-spin mx-auto mb-3" />
        <p className="text-slate-600 font-bold">Loading administrator console...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-teal-400/20 text-teal-300 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-400" /> Government Administration Console
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {t('admin.dashboardTitle')}
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Monitor welfare schemes registry, manage registered citizen profiles, and verify official portal records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/schemes"
            className="px-5 py-3 bg-gov-teal hover:bg-teal-600 text-white font-bold rounded-xl text-sm inline-flex items-center gap-2 shadow-xs transition-colors"
          >
            <FilePlus2 className="w-4 h-4" />
            Manage Schemes
          </Link>
          <Link
            to="/admin/users"
            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 text-sm inline-flex items-center gap-2 transition-colors"
          >
            <Users className="w-4 h-4" />
            Manage Users
          </Link>
        </div>
      </div>

      {/* Stats Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-gov p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('admin.totalUsers')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-gov-blue flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-slate-900 block">
            {stats?.totalUsers || 0}
          </span>
          <span className="text-xs text-slate-400">Registered Citizen Accounts</span>
        </div>

        <div className="card-gov p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Schemes
            </span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-gov-teal flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-slate-900 block">
            {stats?.totalSchemes || 0}
          </span>
          <span className="text-xs text-slate-400">Active in Database</span>
        </div>

        <div className="card-gov p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('admin.centralSchemes')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-slate-900 block">
            {stats?.centralSchemes || 0}
          </span>
          <span className="text-xs text-slate-400">All-India Initiatives</span>
        </div>

        <div className="card-gov p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('admin.stateSchemes')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-slate-900 block">
            {stats?.stateSchemes || 0}
          </span>
          <span className="text-xs text-slate-400">State Government Initiatives</span>
        </div>
      </div>

      {/* Recent Schemes and Audit Logs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Schemes Quick Directory */}
        <div className="card-gov p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-gov-teal" />
              Recent Schemes in System
            </h2>
            <Link
              to="/admin/schemes"
              className="text-xs font-bold text-gov-teal hover:underline inline-flex items-center gap-1"
            >
              All Schemes <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {stats?.recentSchemes?.map((scheme) => (
              <div key={scheme.id} className="py-3 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {scheme.schemeName}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {scheme.department} • {scheme.governmentLevel}
                  </p>
                </div>
                <span className="px-2 py-0.5 text-xs font-bold rounded bg-teal-50 text-teal-800 border border-teal-200 shrink-0">
                  {scheme.verificationStatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Administrative Audit Logs */}
        <div className="card-gov p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-gov-navy" />
              Administrative Audit Trail
            </h2>
            <span className="text-xs text-slate-400 font-medium">Auto-recorded</span>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                No recent administrative actions recorded.
              </p>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="py-3 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono">
                      {log.action}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">
                    {log.details || `Entity: ${log.entityType} #${log.entityId}`}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
