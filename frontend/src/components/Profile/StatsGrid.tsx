import React from 'react';

interface StatsGridProps {
  successfulOrders: number;
  totalOrders: number;
  createdAt: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  successfulOrders,
  totalOrders,
  createdAt
}) => {
  const successRate = totalOrders > 0 ? (successfulOrders / totalOrders * 100).toFixed(0) : '0';
  const monthsActive = Math.floor((Date.now() - new Date(createdAt).getTime()) / (30 * 24 * 60 * 60 * 1000));

  const stats = [
    { value: successfulOrders, label: 'продано' },
    { value: totalOrders - successfulOrders, label: 'куплено' },
    { value: `${successRate}%`, label: 'успех' },
    { value: `${monthsActive}м`, label: 'на площадке' },
  ];

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📊 Статистика</h3>
      <div style={styles.grid}>
        {stats.map((stat, index) => (
          <div key={index} style={styles.statItem}>
            <div style={styles.statValue}>{stat.value}</div>
            <div style={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '16px',
    borderBottom: '1px solid #e0e0e0',
  },
  title: {
    margin: '0 0 12px 0',
    fontSize: '16px',
    fontWeight: 600,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
  },
  statItem: {
    textAlign: 'center' as const,
    padding: '8px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  statValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '12px',
    color: '#666',
  },
};