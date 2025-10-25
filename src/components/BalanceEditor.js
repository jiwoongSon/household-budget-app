import React, { useState, useEffect } from 'react';
import './BalanceEditor.css';

const BalanceEditor = ({ onBalanceUpdate }) => {
  const [balance, setBalance] = useState({ amount: 0, description: '', updated_at: null });
  const [isEditing, setIsEditing] = useState(false);
  const [newAmount, setNewAmount] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // 잔액 조회
  const fetchBalance = async () => {
    try {
      const response = await fetch('/api/balance');
      const data = await response.json();
      setBalance(data);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  };

  // 잔액 수정
  const updateBalance = async () => {
    if (!newAmount || isNaN(newAmount)) {
      alert('올바른 금액을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/balance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(newAmount),
          description: newDescription
        }),
      });

      if (response.ok) {
        await fetchBalance();
        setIsEditing(false);
        setNewAmount('');
        setNewDescription('');
        if (onBalanceUpdate) {
          onBalanceUpdate();
        }
        alert('잔액이 수정되었습니다.');
      } else {
        alert('잔액 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to update balance:', error);
      alert('잔액 수정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = () => {
    setNewAmount(balance.amount.toString());
    setNewDescription(balance.description || '');
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setNewAmount('');
    setNewDescription('');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + ' KRW';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <div className="balance-editor">
      <div className="balance-header">
        <h3>💰 현재 잔액</h3>
        {!isEditing && (
          <button className="edit-button" onClick={startEditing}>
            수정
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="balance-display">
          <div className="balance-amount">
            {formatCurrency(balance.amount)}
          </div>
          {balance.description && (
            <div className="balance-description">
              {balance.description}
            </div>
          )}
          {balance.updated_at && (
            <div className="balance-updated">
              마지막 수정: {formatDate(balance.updated_at)}
            </div>
          )}
        </div>
      ) : (
        <div className="balance-edit-form">
          <div className="form-group">
            <label>잔액 (KRW)</label>
            <input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              placeholder="현재 보유 금액을 입력하세요"
              className="amount-input"
            />
          </div>
          <div className="form-group">
            <label>메모 (선택사항)</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="예: 월급 입금, 현금 보충 등"
              className="description-input"
            />
          </div>
          <div className="form-actions">
            <button 
              className="save-button" 
              onClick={updateBalance}
              disabled={loading}
            >
              {loading ? '저장 중...' : '저장'}
            </button>
            <button 
              className="cancel-button" 
              onClick={cancelEditing}
              disabled={loading}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BalanceEditor;
