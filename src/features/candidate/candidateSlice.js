import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { candidateService } from '../../services/candidateService';

const getApiErrorMessage = (error, fallbackMessage) =>
  error.response?.data?.error ||
  error.response?.data?.message ||
  error.message ||
  fallbackMessage;

// Async thunks
export const fetchCandidates = createAsyncThunk(
  'candidates/fetchCandidates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await candidateService.getAllCandidates();
      if (response.data?.success) {
        return response.data.data || [];
      }
      return rejectWithValue(response.data?.message || 'Failed to fetch candidates');
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Failed to fetch candidates'));
    }
  }
);

export const addCandidate = createAsyncThunk(
  'candidates/addCandidate',
  async (candidateData, { rejectWithValue }) => {
    try {
      const response = await candidateService.createCandidate(candidateData);
      if (response.data?.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data?.message || 'Failed to add candidate');
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Failed to add candidate'));
    }
  }
);

export const updateCandidate = createAsyncThunk(
  'candidates/updateCandidate',
  async ({ id, candidateData }, { rejectWithValue }) => {
    try {
      const response = await candidateService.updateCandidate(id, candidateData);
      if (response.data?.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data?.message || 'Failed to update candidate');
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Failed to update candidate'));
    }
  }
);

export const deleteCandidate = createAsyncThunk(
  'candidates/deleteCandidate',
  async (id, { rejectWithValue }) => {
    try {
      const response = await candidateService.deleteCandidate(id);
      if (response.data?.success) {
        return id;
      }
      return rejectWithValue(response.data?.message || 'Failed to delete candidate');
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Failed to delete candidate'));
    }
  }
);

export const updateCandidateStatus = createAsyncThunk(
  'candidates/updateCandidateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await candidateService.updateCandidateStatus(id, status);
      if (response.data?.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data?.message || 'Failed to update candidate status');
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Failed to update candidate status'));
    }
  }
);

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState: {
    items: [],
    selectedCandidate: null,
    loading: false,
    error: null,
    filters: {
      status: '',
      position: '',
      search: ''
    },
    modal: {
      show: false,
      editing: false,
    },
  },
  reducers: {
    // Modal actions
    showCandidateModal: (state, action) => {
      state.modal.show = true;
      state.modal.editing = !!action.payload;
      state.selectedCandidate = action.payload || null;
    },
    hideCandidateModal: (state) => {
      state.modal.show = false;
      state.modal.editing = false;
      state.selectedCandidate = null;
      state.error = null;
    },
    
    // Selection actions
    setSelectedCandidate: (state, action) => {
      state.selectedCandidate = action.payload;
    },
    
    // Filter actions
    setCandidateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCandidateFilters: (state) => {
      state.filters = {
        status: '',
        position: '',
        search: ''
      };
    },
    
    
    clearCandidateError: (state) => {
      state.error = null;
    },
    
   
    resetCandidates: (state) => {
      state.items = [];
      state.selectedCandidate = null;
      state.loading = false;
      state.error = null;
      state.filters = {
        status: '',
        position: '',
        search: ''
      };
    },
  },
  extraReducers: (builder) => {
    builder
    
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
     
      .addCase(addCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.modal.show = false;
      })
      .addCase(addCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
   
      .addCase(updateCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCandidate.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.modal.show = false;
        state.selectedCandidate = null;
      })
      .addCase(updateCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
   
      .addCase(deleteCandidate.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      .addCase(deleteCandidate.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      
      .addCase(updateCandidateStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateCandidateStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  showCandidateModal,
  hideCandidateModal,
  setSelectedCandidate,
  setCandidateFilters,
  clearCandidateFilters,
  clearCandidateError,
  resetCandidates,
} = candidatesSlice.actions;

export default candidatesSlice.reducer;
