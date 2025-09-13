import React, { createContext, useContext, useState } from 'react';
import apiService from '../config/api';

const JobContext = createContext();

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [userJobs, setUserJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createJob = async (jobData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.createJob(jobData);
      
      if (response.success) {
        // Add new job to user jobs list
        setUserJobs(prev => [response.data, ...prev]);
        return response;
      }
      
      throw new Error(response.message || 'Failed to create job');
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const listJobs = async (filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.listJobs(filters);
      
      if (response.success) {
        setJobs(response.data);
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch jobs');
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserJobs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getUserJobs();
      
      if (response.success) {
        setUserJobs(response.data);
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch user jobs');
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getJob = async (jobId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getJob(jobId);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch job');
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateJob = async (jobId, jobData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.updateJob(jobId, jobData);
      
      if (response.success) {
        // Update job in both lists
        setJobs(prev => prev.map(job => job.id === jobId ? response.data : job));
        setUserJobs(prev => prev.map(job => job.id === jobId ? response.data : job));
        return response;
      }
      
      throw new Error(response.message || 'Failed to update job');
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelJob = async (jobId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.cancelJob(jobId);
      
      if (response.success) {
        // Remove job from both lists
        setJobs(prev => prev.filter(job => job.id !== jobId));
        setUserJobs(prev => prev.filter(job => job.id !== jobId));
        return response;
      }
      
      throw new Error(response.message || 'Failed to cancel job');
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    jobs,
    userJobs,
    isLoading,
    error,
    createJob,
    listJobs,
    getUserJobs,
    getJob,
    updateJob,
    cancelJob,
    clearError,
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};
