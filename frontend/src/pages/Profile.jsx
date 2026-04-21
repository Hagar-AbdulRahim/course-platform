import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import { getFullUrl } from '../utils/urlHelper';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', price: 0, category: '', thumbnail: '' });
  const [editMode, setEditMode] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');
  const [isImgZoomed, setIsImgZoomed] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user.id]);

  const fetchData = async () => {
    try {
      if (user.role === 'student') {
        const { data } = await axios.get('/enrollments/mycourses');
        setMyCourses(data.courses.filter(Boolean));
      } else {
        const { data } = await axios.get('/courses');
        setMyCourses(data.courses.filter(c => c.instructor?._id === user.id));
      }
    } catch (err) { }
    finally { setLoading(false); }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('price', formData.price);
      form.append('category', formData.category);
      if (thumbnailFile) form.append('thumbnail', thumbnailFile);

      if (editMode) {
        await axios.patch(`/courses/${editMode}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await axios.post('/courses', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      setShowForm(false);
      setEditMode(null);
      setFormData({ title: '', description: '', price: 0, category: '' });
      fetchData();
      setMessage('Operation successful!');
    } catch (err) { }
    finally { setCreating(false); }
  };

  const handleDeleteCourse = async (cId) => {
    if (!window.confirm('Delete?')) return;
    try {
      await axios.delete(`/courses/${cId}`);
      fetchData();
    } catch (err) { }
  };

  return (
    <div className='flex flex-col gap-10 pb-20'>
      {/* Header */}
      <div className='card bg-[#001f3f] p-10 md:p-16 text-white rounded-[40px] flex flex-col md:flex-row items-center gap-12'>
        <div className='relative group'>
          <img
            src={getFullUrl(user.profileImage, user.name)}
            alt="Profile"
            className={`w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white/20 object-cover cursor-pointer hover:scale-105 transition-all shadow-2xl ${uploadingImage ? 'opacity-50 grayscale' : ''}`}
            onClick={() => setIsImgZoomed(true)}
          />
          <label className={`absolute bottom-2 right-2 w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:rotate-12 transition-all ${uploadingImage ? 'animate-spin' : ''}`}>
            {uploadingImage ? 'Loading...' : '📷'}
            <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
              const file = e.target.files[0]; if (!file) return;
              setUploadingImage(true);
              const f = new FormData(); f.append('profileImage', file);
              try {
                const { data } = await axios.patch('/auth/profile', f, { headers: { 'Content-Type': 'multipart/form-data' } });
                updateUser(data.user);
                alert('Profile updated successfully! ✨');
              } catch (err) {
                console.error('Upload Error:', err);
                alert('Upload failed: ' + (err.response?.data?.message || err.message));
              }
              finally { setUploadingImage(false); }
            }} />
          </label>
        </div>
        <div className='flex-1 text-center md:text-left space-y-4'>
          <span className='text-[10px] font-black uppercase tracking-[0.4em] bg-white/10 px-4 py-1.5 rounded-full'>Role: {user.role}</span>
          <h1 className='text-4xl md:text-6xl font-black font-heading'>{user.name}</h1>
          <div className='flex flex-wrap justify-center md:justify-start gap-4 pt-4'>
            <div className='bg-white/5 px-5 py-2.5 rounded-2xl border border-white/10'>
              <p className='text-[8px] font-bold text-white/40 uppercase mb-1'>Courses</p>
              <p className='text-lg font-black'>{myCourses.length}</p>
            </div>
            <div className='bg-white/5 px-5 py-2.5 rounded-2xl border border-white/10'>
              <p className='text-[8px] font-bold text-white/40 uppercase mb-1'>Email Address</p>
              <p className='text-lg font-black lowercase truncate max-w-[200px]'>{user.email}</p>
            </div>
            <div className='bg-white/5 px-5 py-2.5 rounded-2xl border border-white/10'>
              <p className='text-[8px] font-bold text-white/40 uppercase mb-1'>Phone Number</p>
              <p className='text-lg font-black'>{user.phoneNumber || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-8'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-black font-heading'>{user.role === 'instructor' ? 'Management Center' : 'Learning Progress'}</h2>
          {user.role === 'instructor' && (
            <button onClick={() => { setShowForm(!showForm); setEditMode(null) }} className='btn-primary px-8 py-3 text-[10px] uppercase font-bold tracking-widest'>
              {showForm ? 'Cancel' : '+ Create Course'}
            </button>
          )}
        </div>

        {showForm && (
          <div className='card p-10 bg-neutral-950 text-white shadow-2xl animate-fade-in'>
            <form onSubmit={handleCreateOrUpdate} className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <input type='text' placeholder='Course Title' value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className='bg-white/5 p-4 rounded-2xl col-span-2' required />
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className='bg-white/5 p-4 rounded-2xl' required>
                <option value='' className='text-black'>Select Faction</option>
                <option value='Web Development' className='text-black'>Web Development</option>
                <option value='Graphic Design' className='text-black'>Graphic Design</option>
                <option value='Marketing' className='text-black'>Marketing</option>
                <option value='Business' className='text-black'>Business</option>
              </select>
              <input type='number' placeholder='Price' value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className='bg-white/5 p-4 rounded-2xl' required />
              <textarea placeholder='Goal & Bio' value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className='bg-white/5 p-4 rounded-2xl col-span-2' rows={2} required />
              <input type='file' onChange={e => setThumbnailFile(e.target.files[0])} className='col-span-2 text-xs' />
              <button type='submit' className='btn-primary col-span-2 py-4 shadow-xl shadow-brand/20 font-black uppercase text-xs tracking-widest'>
                {creating ? 'Processing...' : editMode ? 'Save Changes' : 'Launch Course'}
              </button>
            </form>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {loading ? [1, 2].map(i => <div key={i} className='h-80 bg-neutral-100 rounded-[30px] animate-pulse'></div>) : (
            myCourses.map(course => course && (
              <div key={course._id} className='group card hover:shadow-2xl flex flex-col p-4'>
                <div className='relative aspect-video rounded-3xl overflow-hidden mb-6'>
                  <img src={getFullUrl(course.thumbnail)} className='w-full h-full object-cover transition-transform group-hover:scale-105' />
                  {user.role === 'instructor' && (
                    <div className='absolute top-3 right-3 flex gap-2'>
                      <button onClick={() => { setEditMode(course._id); setShowForm(true); setFormData({ title: course.title, category: course.category, price: course.price, description: course.description }) }} className='w-8 h-8 rounded-full bg-white text-blue-500 shadow-xl flex items-center justify-center font-bold text-[10px]'>✏️</button>
                      <button onClick={() => handleDeleteCourse(course._id)} className='w-8 h-8 rounded-full bg-white text-red-500 shadow-xl flex items-center justify-center font-bold text-[10px]'>🗑️</button>
                    </div>
                  )}
                </div>
                <h4 className='font-bold text-sm mb-2 px-2'>{course.title}</h4>
                <p className='text-[10px] text-neutral-400 mb-6 px-2 line-clamp-2'>{course.description}</p>

                <div className='mt-auto flex flex-col gap-2'>
                  {user.role === 'instructor' ? (
                    <>
                      <Link to={`/courses/${course._id}`} className='btn-primary w-full py-2.5 text-[9px] uppercase tracking-widest text-center'>Add Lesson </Link>
                      <div className='flex gap-2'>
                        <Link
                          to={`/courses/${course._id}`}
                          state={{ activeTab: 'students' }}
                          className='btn-secondary flex-1 py-2 text-[9px] uppercase tracking-widest text-center'
                        >Details </Link>
                        <Link
                          to={`/courses/${course._id}`}
                          state={{ activeTab: 'feedback' }}
                          className='btn-secondary flex-1 py-2 text-[9px] uppercase tracking-widest text-center'
                        >Feedback</Link>
                      </div>
                    </>
                  ) : (
                    <Link to={`/courses/${course._id}`} className='btn-primary w-full py-2.5 text-[9px] uppercase tracking-widest text-center'>Continue Learning</Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isImgZoomed && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-10 cursor-zoom-out" onClick={() => setIsImgZoomed(false)}>
          <img src={getFullUrl(user.profileImage, user.name)} className="max-h-full max-w-full rounded-2xl shadow-white/5 shadow-2xl" />
        </div>
      )}
    </div>
  );
};

export default Profile;
