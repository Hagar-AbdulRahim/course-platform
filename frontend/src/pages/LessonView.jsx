import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { getFullUrl } from '../utils/urlHelper';

const LessonView = () => {
   const { id, lessonId } = useParams();
   const { user } = useAuth();
   const [lesson, setLesson] = useState(null);
   const [allLessons, setAllLessons] = useState([]);
   const [course, setCourse] = useState(null);
   const [comments, setComments] = useState([]);
   const [courseStudents, setCourseStudents] = useState([]);
   const [commentText, setCommentText] = useState('');
   const [loading, setLoading] = useState(true);

   // Instructor helper state
   const [showAddForm, setShowAddForm] = useState(false);
   const [newLesson, setNewLesson] = useState({ title: '', content: '', duration: 15 });
   const [videoFile, setVideoFile] = useState(null);
   const [uploading, setUploading] = useState(false);

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         try {
            // Essential data first
            const [courseRes, lessonsRes, lessonRes, commentsRes] = await Promise.all([
               axios.get(`/courses/${id}`),
               axios.get(`/courses/${id}/lessons`),
               axios.get(`/courses/${id}/lessons/${lessonId}`),
               axios.get(`/lessons/${lessonId}/comments`)
            ]);

            setCourse(courseRes.data);
            setAllLessons(lessonsRes.data.lessons);
            setLesson(lessonRes.data.lesson || lessonsRes.data.lessons.find(l => l._id === lessonId));
            setComments(commentsRes.data.comments);

            // Conditional instructor-only data
            if (user && user.role === 'instructor') {
               try {
                  const studentsRes = await axios.get(`/enrollments/${id}/students`);
                  setCourseStudents(studentsRes.data.students);
               } catch (err) {
                  console.warn('Could not fetch students - might not be the instructor');
               }
            }
         } catch (err) {
            console.error('Error loading lesson view data:', err);
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, [id, lessonId, user]);

   const handleAddComment = async (e) => {
      e.preventDefault();
      if (!commentText.trim()) return;
      try {
         await axios.post(`/lessons/${lessonId}/comments`, { content: commentText });
         setCommentText('');
         const { data } = await axios.get(`/lessons/${lessonId}/comments`);
         setComments(data.comments);
      } catch (err) { }
   };

   const handleCreateLesson = async (e) => {
      e.preventDefault();
      setUploading(true);
      try {
         const form = new FormData();
         form.append('title', newLesson.title);
         form.append('content', newLesson.content);
         form.append('duration', newLesson.duration);
         form.append('order', allLessons.length + 1);
         if (videoFile) form.append('video', videoFile);

         await axios.post(`/courses/${id}/lessons`, form, {
            headers: { 'Content-Type': 'multipart/form-data' }
         });

         const { data } = await axios.get(`/courses/${id}/lessons`);
         setAllLessons(data.lessons);
         setShowAddForm(false);
         setNewLesson({ title: '', content: '', duration: 15 });
         setVideoFile(null);
      } catch (err) {
         console.error(err);
      } finally {
         setUploading(false);
      }
   };

   if (loading) return <div className="flex justify-center items-center h-screen animate-pulse">
      <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
   </div>;

   const isInstructorOfThisCourse = user?.role === 'instructor' && course?.instructor?._id === user?.id;
   const currentLessonIndex = allLessons.findIndex(l => l._id === lessonId) + 1;

   return (
      <div className="pb-20">
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

            {/* Sidebar */}
            <div className="lg:col-span-1 hidden lg:block space-y-6">
               <Link to={`/courses/${id}`} className="text-[10px] font-black uppercase text-neutral-400 hover:text-brand flex items-center gap-2 mb-4 group tracking-widest">
                  <span className="group-hover:-translate-x-1 transition-transform">←</span> Course Home
               </Link>
               <div className="card p-6 border-none shadow-md sticky top-24 bg-white dark:bg-neutral-800 transition-colors">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand mb-6">Course Lessons</h4>
                  <div className="flex flex-col gap-3">
                     {allLessons.map((l, idx) => (
                        <Link key={l._id} to={`/courses/${id}/lessons/${l._id}`} className={`p-4 rounded-xl flex items-center gap-3 transition-all ${l._id === lessonId ? 'bg-brand text-white shadow-xl shadow-brand/20' : 'hover:bg-neutral-50 dark:hover:bg-neutral-700'}`}>
                           <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${l._id === lessonId ? 'bg-white/20' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-400'}`}>{idx + 1}</span>
                           <span className={`text-[11px] font-bold line-clamp-1 ${l._id === lessonId ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>{l.title}</span>
                        </Link>
                     ))}
                  </div>
               </div>
            </div>

            {/* Player and Comments Area */}
            <div className="lg:col-span-3 space-y-10 reveal-anim active">
               <div className="card border-none shadow-md bg-white dark:bg-neutral-800 overflow-hidden p-6 md:p-8 transition-colors">
                  <div className="flex justify-between items-center mb-8">
                     <div className="flex items-center gap-3">
                        <span className="bg-neutral-100 dark:bg-neutral-700 text-neutral-400 text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">Lesson {currentLessonIndex} / {allLessons.length}</span>
                        <h1 className="text-xl md:text-2xl font-black font-heading text-neutral-900 dark:text-white">{lesson?.title}</h1>
                     </div>
                     {isInstructorOfThisCourse && (
                        <button onClick={() => setShowAddForm(true)} className="btn-primary text-[9px] px-6 py-2 uppercase tracking-widest">+ New Lesson</button>
                     )}
                  </div>

                  <div className="aspect-video bg-black rounded-3xl overflow-hidden mb-10 shadow-lg relative">
                     {lesson?.videoUrl ? (
                        <video key={lessonId} width="100%" height="100%" controls className="w-full h-full">
                           <source src={getFullUrl(lesson.videoUrl)} type="video/mp4" />
                        </video>
                     ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 bg-neutral-900 px-10 text-center">
                           <p className="font-bold">Content is coming soon.</p>
                        </div>
                     )}
                  </div>

                  <div className="space-y-6">
                     <p className="text-[10px] font-black uppercase text-brand tracking-widest underline decoration-brand/30">Detailed Context</p>
                     <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm bg-neutral-50 dark:bg-neutral-900/50 p-8 rounded-[30px] border border-neutral-100 dark:border-neutral-700 italic">
                        "{lesson?.content || 'No specific description provided.'}"
                     </p>
                  </div>
               </div>

               {showAddForm && (
                  <div className="fixed inset-0 z-[100] glass flex items-center justify-center p-6 animate-fade-in">
                     <div className="card p-10 max-w-lg w-full border-none shadow-2xl bg-white dark:bg-neutral-800 reveal-anim active">
                        <h3 className="text-xl font-bold mb-6 dark:text-white">Quick Lesson Release</h3>
                        <form onSubmit={handleCreateLesson} className="flex flex-col gap-5">
                           <input type="text" placeholder="Lesson Name" className="input-field dark:bg-neutral-700 dark:text-white"
                              value={newLesson.title} onChange={e => setNewLesson({ ...newLesson, title: e.target.value })} required />
                           <textarea placeholder="Outline & Summary" className="input-field dark:bg-neutral-700 dark:text-white" rows={4}
                              value={newLesson.content} onChange={e => setNewLesson({ ...newLesson, content: e.target.value })} required />
                           <input type="file" accept="video/*" className="text-xs dark:text-neutral-400"
                              onChange={e => setVideoFile(e.target.files[0])} />
                           <div className="flex gap-4">
                              <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 btn-secondary text-xs">Discard</button>
                              <button type="submit" disabled={uploading} className="flex-1 btn-primary text-xs">{uploading ? 'Processing...' : 'Publish'}</button>
                           </div>
                        </form>
                     </div>
                  </div>
               )}

               {/* Discussions */}
               <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                  <div className="lg:col-span-3 space-y-8">
                     <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-brand rounded-full"></div>
                        <h3 className="text-xl font-bold dark:text-white">Comments ({comments.length})</h3>
                     </div>

                     <div className="card p-6 md:p-10 border-none shadow-xl bg-white dark:bg-neutral-800 transition-colors space-y-10">
                        <form onSubmit={handleAddComment} className="flex gap-4">
                           <input
                              type="text"
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="Ask a question..."
                              className="input-field rounded-full pl-6 flex-1 dark:bg-neutral-700 dark:text-white"
                           />
                           <button type="submit" className="btn-primary rounded-full px-8 font-black uppercase text-[9px] tracking-widest">Post</button>
                        </form>

                        <div className="flex flex-col gap-6">
                           {comments.length === 0 ? (
                              <div className="py-10 text-center text-neutral-400 font-bold uppercase text-[10px] tracking-widest italic animate-pulse">Waiting for the first insight...</div>
                           ) : comments.map((c) => (
                              <div key={c._id} className="p-6 rounded-[30px] border border-neutral-50 dark:border-neutral-700 bg-neutral-50/20 dark:bg-neutral-900/20 flex gap-6 animate-fade-in-up">
                                 <img src={getFullUrl(c.student?.profileImage, c.student?.name)} className="w-12 h-12 rounded-2xl object-cover shadow-sm bg-white" alt="U" />
                                 <div className="flex-1">
                                    <p className="font-bold text-neutral-800 dark:text-white text-sm">
                                       {c.student?.name}
                                       <span className="text-[9px] bg-brand/10 text-brand px-2 py-0.5 rounded-full ml-2 uppercase">{c.student?.university || 'Scholar'}</span>
                                       <span className="text-[10px] text-neutral-400 font-medium ml-2">{new Date(c.createdAt).toLocaleDateString()}</span>
                                    </p>
                                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-2 leading-relaxed">{c.content}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Active Members - Only for Instructors or general info */}
                  <div className="lg:col-span-2 space-y-8">
                     <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-green-500 rounded-full"></div>
                        <h3 className="text-xl font-bold dark:text-white">Active Members</h3>
                     </div>
                     <div className="card p-6 border-none shadow-xl bg-white dark:bg-neutral-800 transition-colors space-y-6">
                        <p className="text-[9px] font-black uppercase text-neutral-400 tracking-widest mb-4">Total: {courseStudents.length} Students</p>
                        <div className="flex flex-col gap-4">
                           {courseStudents.length === 0 && <p className="text-neutral-400 text-[10px] italic">No public logs available.</p>}
                           {courseStudents.map(s => (
                              <div key={s._id} className="flex items-center gap-4 p-3 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-2xl transition-all group">
                                 <img src={getFullUrl(s.profileImage) || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop'} className="w-10 h-10 rounded-xl object-cover" alt="S" />
                                 <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold truncate group-hover:text-brand transition-colors text-neutral-900 dark:text-white">{s.name}</p>
                                    <p className="text-[9px] text-neutral-400 truncate mt-0.5">{s.email}</p>
                                    <p className="text-[9px] text-brand truncate uppercase font-bold mt-0.5">{s.phoneNumber || 'No Mobile'}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default LessonView;
