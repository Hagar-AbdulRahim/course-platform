import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseById } from '../store/slices/courseSlice';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { getFullUrl } from '../utils/urlHelper';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { course, loading } = useSelector((state) => state.courses);
  const { user } = useAuth();

  const [lessons, setLessons] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Management States
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'overview');
  const [courseStudents, setCourseStudents] = useState([]);
  const [courseComments, setCourseComments] = useState([]);
  const [lessonForm, setLessonForm] = useState({ title: '', content: '', order: 1 });
  const [videoFile, setVideoFile] = useState(null);
  const [addingLesson, setAddingLesson] = useState(false);
  const [lessonMessage, setLessonMessage] = useState('');
  const [lessonEditMode, setLessonEditMode] = useState(null);

  const isInstructor = user && course && course.instructor?._id === user.id;

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const { data } = await axios.get(`/courses/${id}/lessons`);
        setLessons(data.lessons);
      } catch (err) { }
    };

    const checkEnrollment = async () => {
      if (!user) return;
      try {
        const { data } = await axios.get('/enrollments/mycourses');
        const isEnrolled = data.courses.some(c => c && c._id === id);
        setEnrolled(isEnrolled);
      } catch (err) { }
    };

    dispatch(fetchCourseById(id));
    fetchLessons();
    checkEnrollment();
  }, [id, dispatch, user]);

  const fetchManagementData = useCallback(async () => {
    try {
      if (activeTab === 'students') {
        const { data } = await axios.get(`/enrollments/${id}/students`);
        setCourseStudents(data.students || []);
      } else if (activeTab === 'feedback') {
        const { data: lessonsRes } = await axios.get(`/courses/${id}/lessons`);
        if (lessonsRes.lessons) {
          const commentPromises = lessonsRes.lessons.map(l =>
            axios.get(`/lessons/${l._id}/comments`).catch(() => ({ data: { comments: [] } }))
          );
          const allResults = await Promise.all(commentPromises);
          setCourseComments(allResults.flatMap(res => res.data.comments || []));
        }
      }
    } catch (err) { }
  }, [activeTab, id]);

  useEffect(() => {
    if (isInstructor && activeTab !== 'overview') {
      fetchManagementData();
    }
  }, [activeTab, isInstructor, fetchManagementData]);

  const handleEnrollClick = async () => {
    if (!user) { navigate('/login'); return; }
    if (enrolled) return;
    if (user.role === 'instructor') return;

    setEnrolling(true);
    try {
      await axios.post(`/enrollments/${id}`);
      setEnrolled(true);
    } catch (err) { }
    finally { setEnrolling(false); }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    setAddingLesson(true);
    try {
      const form = new FormData();
      form.append('title', lessonForm.title);
      form.append('content', lessonForm.content);
      if (videoFile) form.append('video', videoFile);
      await axios.post(`/courses/${id}/lessons`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setLessonMessage('Lesson added!');
      setLessonForm({ title: '', content: '' });
      setVideoFile(null);
      const { data } = await axios.get(`/courses/${id}/lessons`);
      setLessons(data.lessons);
      dispatch(fetchCourseById(id));
    } catch (err) { }
    finally { setAddingLesson(false); }
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    setAddingLesson(true);
    try {
      const form = new FormData();
      form.append('title', lessonForm.title);
      form.append('content', lessonForm.content);
      if (videoFile) form.append('video', videoFile);
      await axios.patch(`/lessons/${lessonEditMode}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setLessonMessage('Lesson updated!');
      setLessonEditMode(null);
      setLessonForm({ title: '', content: '' });
      const { data } = await axios.get(`/courses/${id}/lessons`);
      setLessons(data.lessons);
      dispatch(fetchCourseById(id));
    } catch (err) { }
    finally { setAddingLesson(false); }
  };

  const handleDeleteLesson = async (lId) => {
    if (!window.confirm('Delete?')) return;
    try {
      await axios.delete(`/lessons/${lId}`);
      const { data } = await axios.get(`/courses/${id}/lessons`);
      setLessons(data.lessons);
      dispatch(fetchCourseById(id));
    } catch (err) { }
  };

  if (loading) return <div className="flex justify-center py-20 animate-pulse text-neutral-400 font-bold uppercase tracking-widest text-[10px]">Loading Syllabus...</div>;
  if (!course) return <div className="text-center py-20 text-neutral-400 font-bold">Course Not Found</div>;

  return (
    <div className='flex flex-col gap-8 pb-32'>
      {/* Header */}
      <section className='card bg-[#001f3f] overflow-hidden min-h-[350px] flex flex-col md:flex-row relative'>
        <div className='flex-1 p-10 md:p-16 flex flex-col justify-center gap-6 relative z-10 text-white'>
          <div className='flex items-center gap-2'>
            <span className='text-[9px] font-black uppercase tracking-[0.3em] text-brand'>Category: {course.category}</span>
          </div>
          <h1 className='text-3xl md:text-5xl font-black font-heading'>{course.title}</h1>
          <p className='text-white/60 text-xs max-w-xl leading-relaxed'>{course.description}</p>

          <div className='flex items-center gap-8 pt-4'>
            <div>
              <p className='text-[8px] font-black text-brand uppercase tracking-widest'>Instructor</p>
              <p className='text-white font-bold text-sm'>{course.instructor?.name}</p>
            </div>
            <div>
              <p className='text-[8px] font-black text-brand uppercase tracking-widest'>Enrollment</p>
              <p className='text-white font-bold text-sm'>{course.studentsCount || 0} Students</p>
            </div>
            <div>
              <p className='text-[8px] font-black text-brand uppercase tracking-widest'>Lessons</p>
              <p className='text-white font-bold text-sm'>{course.lessonsCount || 0} Lessons</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      {isInstructor && (
        <div className='flex gap-4 border-b border-neutral-100 pb-4'>
          {['overview', 'students', 'feedback'].map(tab => (
            <button key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full transition-all ${activeTab === tab ? 'bg-brand text-white shadow-lg' : 'text-neutral-400 hover:bg-neutral-100'}`}>
              {tab}
            </button>
          ))}
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
        <div className='lg:col-span-2 space-y-12'>
          {activeTab === 'overview' && (
            <div className='space-y-12'>
              {isInstructor && (
                <div className='card p-8 border-none bg-neutral-950 text-white shadow-2xl'>
                  <h3 className='text-sm font-bold mb-6 text-brand uppercase tracking-widest'>Manage Content</h3>
                  <form onSubmit={lessonEditMode ? handleUpdateLesson : handleAddLesson} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <input type='text' placeholder='Title' value={lessonForm.title} onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })} className='bg-white/5 p-3 rounded-xl text-xs outline-none focus:ring-1 ring-brand' required />
                    <input type='file' onChange={e => setVideoFile(e.target.files[0])} className='text-[10px] pt-3' accept='video/*' />
                    <textarea placeholder='Content' value={lessonForm.content} onChange={e => setLessonForm({ ...lessonForm, content: e.target.value })} className='bg-white/5 p-3 rounded-xl text-xs col-span-2' rows={2} required />
                    <div className='col-span-2 flex gap-4'>
                      <button type='submit' className='btn-primary flex-1 py-3 text-[10px] uppercase font-bold tracking-widest'>
                        {addingLesson ? 'Saving...' : lessonEditMode ? 'Update Lesson' : 'Add Lesson'}
                      </button>
                      {lessonEditMode && <button type='button' onClick={() => { setLessonEditMode(null); setLessonForm({ title: '', content: '' }) }} className='bg-white/10 px-6 rounded-xl text-[10px] font-bold'>Cancel</button>}
                    </div>
                  </form>
                  {lessonMessage && <p className='text-brand text-[9px] mt-4 font-bold uppercase'>{lessonMessage}</p>}
                </div>
              )}

              <div className='space-y-4'>
                <h3 className='text-sm font-black uppercase tracking-widest text-neutral-400 mb-6'>Lessons ({lessons.length})</h3>
                <div className='flex flex-col gap-3'>
                  {lessons.map((lesson, idx) => (
                    <div key={lesson._id} className='card p-4 flex items-center justify-between group reveal-anim active'>
                      <div className='flex items-center gap-4'>
                        <span className='w-8 h-8 rounded-lg bg-neutral-50 text-neutral-400 flex items-center justify-center font-bold text-xs'>{idx + 1}</span>
                        <div>
                          <h4 className='text-xs font-bold'>{lesson.title}</h4>
                        </div>
                      </div>
                      <div className='flex items-center gap-3'>
                        {isInstructor && (
                          <>
                            <button onClick={() => { setLessonEditMode(lesson._id); setLessonForm({ title: lesson.title, content: lesson.content }) }} className='text-[9px] font-bold text-blue-500 hover:underline'>Edit</button>
                            <button onClick={() => handleDeleteLesson(lesson._id)} className='text-[9px] font-bold text-red-500 hover:underline'>Delete</button>
                          </>
                        )}
                        {(enrolled || isInstructor) ? (
                          <Link to={`/courses/${id}/lessons/${lesson._id}`} className='btn-primary text-[8px] py-1 px-4'>Watch</Link>
                        ) : (
                          <span className='text-[8px] font-black text-neutral-300'>Locked 🔒</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className='card p-0 overflow-hidden'>
              <table className='w-full text-left text-sm'>
                <thead className='bg-neutral-50 text-neutral-400'>
                  <tr>
                    <th className='p-4 text-[9px] uppercase font-black'>Student Name</th>
                    <th className='p-4 text-[9px] uppercase font-black'>Contact (Email / Mobile)</th>
                    <th className='p-4 text-[9px] uppercase font-black'>Educational Info</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-neutral-100'>
                  {courseStudents.map(s => (
                    <tr key={s._id}>
                      <td className='p-4 font-bold flex items-center gap-3'>
                        <img src={getFullUrl(s.profileImage, s.name)} alt={s.name} className='w-8 h-8 rounded-full border shadow-sm' />
                        {s.name}
                      </td>
                      <td className='p-4 text-xs text-neutral-500'>
                        <div>{s.email}</div>
                        <div className="text-[10px] text-neutral-400 font-black mt-1">{s.phoneNumber || 'N/A'}</div>
                      </td>
                      <td className='p-4 text-xs text-neutral-500'>{s.university || 'Unspecified'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className='space-y-4'>
              {courseComments.map(c => (
                <div key={c._id} className='card p-5 border-none shadow-sm flex items-start gap-4'>
                  <img src={getFullUrl(c.student?.profileImage)} alt={c.student?.name || 'Student'} className='w-10 h-10 rounded-full border shadow-sm' />
                  <div>
                    <p className='text-[10px] font-black uppercase text-brand mb-1'>{c.student?.name}</p>
                    <p className='text-xs text-neutral-600'>{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {activeTab === 'overview' && (
          <div className='lg:col-span-1'>
            <div className='card p-8 sticky top-24 bg-white'>
              <div className='text-center mb-8 pb-8 border-b'>
                <p className='text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-4'>Access Terms</p>
                {enrolled || isInstructor ? (
                  <div className='py-4'>
                    <p className='text-lg font-black text-brand'>Full Access Granted</p>
                  </div>
                ) : (
                  <div className='flex flex-col gap-6'>
                    <span className='text-4xl font-black'>${course.price}</span>
                    <button onClick={handleEnrollClick} disabled={enrolling} className='btn-primary py-4 w-full text-[10px] uppercase font-bold tracking-widest'>
                      {enrolling ? 'Enrolling...' : 'Enroll Now'}
                    </button>
                  </div>
                )}
              </div>
              <div className='space-y-4'>
                {['Full HD Experience', 'Accredited Certificate', 'Private Community'].map(f => (
                  <div key={f} className='flex items-center gap-3 text-neutral-500'>
                    <span className='text-[10px] font-bold uppercase tracking-widest'>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;