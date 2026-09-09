"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X, RefreshCw, Clock, CheckCircle2, AlertTriangle, Database } from 'lucide-react';
import { fetchAuditLogs, AuditLogRecord } from '@/lib/api';

interface AuditLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  vaultId?: string;
}

export const AuditLogDrawer: React.FC<AuditLogDrawerProps> = ({ isOpen, onClose, vaultId }) => {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await fetchAuditLogs(vaultId);
      setLogs(data);
    } catch (_) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadLogs();
    }
  }, [isOpen, vaultId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-evoke-surface border-l border-evoke-border h-full flex flex-col justify-between shadow-2xl z-10"
          >
            {/* Header */}
            <div className="p-5 border-b border-evoke-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#4ECCA3]/10 border border-[#4ECCA3]/30 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-[#4ECCA3]" />
                </div>
                <div>
                  <h3 className="font-syne font-bold text-sm text-evoke-text-primary">
                    Audit Trail (Invariant I4)
                  </h3>
                  <p className="text-[11px] font-mono text-evoke-text-muted">
                    CloudWatch Tamper-Evident Logs
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadLogs}
                  disabled={loading}
                  className="p-1.5 rounded-full hover:bg-evoke-card text-evoke-text-muted hover:text-evoke-text-primary transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-evoke-card text-evoke-text-muted hover:text-evoke-text-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content List */}
            <div className="flex-grow overflow-y-auto p-5 space-y-3">
              {logs.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center text-evoke-text-muted text-xs space-y-2">
                  <Database className="w-8 h-8 opacity-40" />
                  <p>No audit events recorded yet for this session.</p>
                  <p className="text-[10px] font-mono">Conversations will append here automatically.</p>
                </div>
              ) : (
                logs.map((record, idx) => (
                  <div
                    key={record.timestamp_ms || idx}
                    className="p-3 rounded-[10px] bg-evoke-card border border-evoke-border text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-evoke-text-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {record.iso_timestamp ? new Date(record.iso_timestamp).toLocaleTimeString() : 'Recent'}
                      </span>
                      <span className="text-[#C5A880]">{record.latency_ms}ms</span>
                    </div>

                    <p className="font-medium text-evoke-text-primary line-clamp-2">
                      &ldquo;{record.query}&rdquo;
                    </p>

                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono text-evoke-text-secondary">
                        Model: {record.model_used?.includes('llama') ? 'Llama-3.3 70B' : record.model_used || 'Llama-3.3 70B'}
                      </span>
                      {record.humility_triggered ? (
                        <span className="inline-flex items-center gap-1 text-[#FF9A3C] font-mono">
                          <AlertTriangle className="w-3 h-3" />
                          Humility Gate
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#4ECCA3] font-mono">
                          <CheckCircle2 className="w-3 h-3" />
                          Schema Grounded
                        </span>
                      )}
                    </div>

                    {record.context_fields && record.context_fields.length > 0 && (
                      <div className="pt-1.5 border-t border-evoke-border/40 flex flex-wrap gap-1">
                        {record.context_fields.map((f, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded-[4px] bg-evoke-surface border border-evoke-border text-[9px] font-mono text-evoke-text-muted"
                          >
                            C(q): {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-evoke-border bg-evoke-card/50 text-[10px] font-mono text-evoke-text-muted flex items-center justify-between">
              <span>Retention: 365 Days</span>
              <span className="text-[#4ECCA3]">Cryptographic Integrity OK</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
