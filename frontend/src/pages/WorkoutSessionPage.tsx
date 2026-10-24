import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { Workout } from '../types';
import { WorkoutSession } from '../components/workout/WorkoutSession';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';

export const WorkoutSessionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/workout');
      return;
    }

    const initSession = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const wData = await api.getWorkout(id);
        setWorkout(wData);

        const sData = await api.startWorkout(id).catch(() => null);
        if (sData?.id) {
          setSessionId(sData.id);
        }
      } catch (err: any) {
        console.error('Failed to init workout session', err);
        setError(err.message || 'Could not start workout session');
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, [id, navigate]);

  const handleFinish = async (durationSeconds: number, effort: 'Too easy' | 'Good' | 'Hard') => {
    try {
      const activeSessionId = sessionId || 'direct-session';
      await api.completeSession(activeSessionId, {
        duration_seconds: durationSeconds,
        perceived_effort: effort,
        status: 'COMPLETED',
        completion_rate: 1.0,
      });
      // Complete daily movement quest and award earned XP
      await api.completeQuest('quest-movement').catch(() => null);
      navigate('/home');
    } catch (err) {
      console.error('Failed to complete session', err);
      navigate('/home');
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-6 space-y-4">
        <Skeleton className="w-48 h-48 rounded-full" />
        <Skeleton className="w-64 h-8" />
        <Skeleton className="w-40 h-4" />
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="max-w-md mx-auto py-12">
        <ErrorState message={error || 'Workout not found'} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <WorkoutSession
      workout={workout}
      onExit={() => navigate('/workout')}
      onFinished={handleFinish}
    />
  );
};
