import React from 'react';
import { Badge, IconButton, Tooltip } from '@mui/material';
import { Warning, Error, Info, CheckCircle } from '@mui/icons-material';
import { MedicalAlert } from '../../../providers/medical-decision-support/types';

interface AlertBadgeProps {
  alerts: MedicalAlert[];
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export const AlertBadge: React.FC<AlertBadgeProps> = ({ alerts, onClick, size = 'medium' }) => {
  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const highCount = alerts.filter(a => a.severity === 'high').length;
  const totalCount = alerts.length;

  const getIcon = () => {
    if (criticalCount > 0) return <Error color="error" />;
    if (highCount > 0) return <Warning color="warning" />;
    if (totalCount > 0) return <Info color="info" />;
    return <CheckCircle color="success" />;
  };

  const getTooltip = () => {
    if (totalCount === 0) return 'No medical alerts';
    return `${totalCount} medical alert${totalCount > 1 ? 's' : ''} (${criticalCount} critical, ${highCount} high priority)`;
  };

  return (
    <Tooltip title={getTooltip()}>
      <IconButton onClick={onClick} size={size}>
        <Badge 
          badgeContent={totalCount} 
          color={criticalCount > 0 ? 'error' : highCount > 0 ? 'warning' : 'info'}
          max={99}
        >
          {getIcon()}
        </Badge>
      </IconButton>
    </Tooltip>
  );
};