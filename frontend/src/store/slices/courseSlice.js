import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// جيب كل الكورسات
export const fetchCourses = createAsyncThunk(
  'courses/fetchAll',
  async (
    { page = 1, keyword = '', category = '' } = {},
    { rejectWithValue }
  ) => {
    try {
      const query = new URLSearchParams({ page, keyword });
      if (category) query.set('category', category);
      const { data } = await axios.get(`/courses?${query.toString()}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// جيب كورس واحد
export const fetchCourseById = createAsyncThunk(
  'courses/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/courses/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// عمل كورس جديد
export const createCourse = createAsyncThunk(
  'courses/create',
  async (courseData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/courses', courseData);
      return data.course;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [],
    course: null,
    loading: false,
    error: null,
    total: 0,
    pages: 1,
    page: 1,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCourse: (state) => {
      state.course = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.course = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.courses.unshift(action.payload);
      });
  },
});

export const { clearError, clearCourse } = courseSlice.actions;
export default courseSlice.reducer;
