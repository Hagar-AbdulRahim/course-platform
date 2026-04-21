import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';

const countries = [
  "Egypt", "Saudi Arabia", "United Arab Emirates", "Jordan", "Kuwait",
  "Morocco", "Tunisia", "Algeria", "Qatar", "Bahrain", "USA", "UK"
];

const universities = [
  "Cairo University", "Ain Shams University", "Alexandria University",
  "Mansoura University", "Assiut University", "Helwan University", "Other"
];

const faculties = [
  "Engineering", "Computers and Information", "Science", "Commerce",
  "Medicine", "Pharmacy", "Arts", "Law", "Other"
];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    phoneNumber: '',
    country: 'Egypt',
    university: '',
    faculty: '',
    goal: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const form = new FormData();
      Object.keys(formData).forEach(key => form.append(key, formData[key]));
      if (profileImage) form.append('profileImage', profileImage);

      await axios.post('/auth/register', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-[80vh] flex items-center justify-center py-10'>
      <div className='card max-w-4xl w-full p-10 grid grid-cols-1 lg:grid-cols-5 gap-12 border-none shadow-2xl relative overflow-hidden bg-white'>

        {/* Left Side: Branding */}
        <div className='lg:col-span-2 flex flex-col justify-center bg-brand/5 p-10 rounded-3xl border border-brand/10'>
          <div className='mb-8'>
            <Link to="/" className='text-3xl font-black text-brand mb-4 block'>EduFlex</Link>
            <h2 className='text-4xl font-black leading-tight mb-6'>Join the Future of Learning</h2>
            <p className='text-sm text-neutral-500 leading-relaxed mb-8'>
              Whether you are a student looking to master new skills or an instructor ready to share your expertise,
              EduFlex provides the tools you need to succeed.
            </p>
          </div>

          <div className='space-y-6'>
            <div className='flex items-center gap-4 bg-white/50 p-4 rounded-2xl'>
              <div>
                <p className='text-xs font-black uppercase text-brand '>Accelerate</p>
                <p className='text-[10px] text-neutral-400 font-bold text-white'>Learn faster with HD content</p>
              </div>
            </div>
            <div className='flex items-center gap-4 bg-white/50 p-4 rounded-2xl'>
              <div>
                <p className='text-xs font-black uppercase text-brand'>Global</p>
                <p className='text-[10px] text-white text-neutral-400 font-bold'>Join 50k+ active users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className='lg:col-span-3'>
          <h3 className='text-xl font-bold mb-8'>Sign Up Now</h3>

          <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-6'>

            <div className='space-y-1 col-span-2'>
              <label className='text-[10px] font-black uppercase text-neutral-400'>Full Name</label>
              <input type='text' placeholder='Full Name' className='input-field' value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>

            <div className='space-y-1 col-span-2'>
              <label className='text-[10px] font-black uppercase text-neutral-400'>Profile Picture (Optional)</label>
              <input type='file' className='input-field pt-2' accept='image/*'
                onChange={(e) => setProfileImage(e.target.files[0])} />
            </div>

            <div className='space-y-1'>
              <label className='text-[10px] font-black uppercase text-neutral-400'>Email Address</label>
              <input type='email' placeholder='Email Address' className='input-field' value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>

            <div className='space-y-1'>
              <label className='text-[10px] font-black uppercase text-neutral-400'>Phone Number</label>
              <input type='text' placeholder='Phone Number' className='input-field' value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} required />
            </div>

            {error && <p className='text-red-500 text-xs mb-6 font-bold bg-red-50 p-3 rounded-lg border border-red-100'>Error: {error}</p>}

            <div className='space-y-1'>
              <label className='text-[10px] font-black uppercase text-neutral-400'>Password</label>
              <input 
                type='password' 
                placeholder='Password (min 6 chars)' 
                className='input-field' 
                value={formData.password}
                autoComplete='new-password'
                minLength="6"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                required 
              />
            </div>

            <div className='space-y-1'>
              <label className='text-[10px] font-black uppercase text-neutral-400'>Select Country</label>
              <select className='input-field h-[42px]' value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {formData.role === 'student' && (
              <>
                <div className='space-y-1'>
                  <label className='text-[10px] font-black uppercase text-neutral-400'>University</label>
                  <select className='input-field h-[42px]' value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })} required>
                    <option value="">Select University</option>
                    {universities.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div className='space-y-1'>
                  <label className='text-[10px] font-black uppercase text-neutral-400'>Faculty</label>
                  <select className='input-field h-[42px]' value={formData.faculty}
                    onChange={(e) => setFormData({ ...formData, faculty: e.target.value })} required>
                    <option value="">Select Faculty</option>
                    {faculties.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div className='space-y-1 col-span-2'>
                  <label className='text-[10px] font-black uppercase text-neutral-400'>What is your goal for joining?</label>
                  <input type="text" placeholder="e.g. Master React, Digital Marketing..." className='input-field'
                    value={formData.goal} onChange={(e) => setFormData({ ...formData, goal: e.target.value })} required />
                </div>
              </>
            )}

            <div className='space-y-1 col-span-2'>
              <label className='text-[10px] font-black uppercase text-neutral-400'>Account Role</label>
              <select className='input-field h-[42px]' value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                <option value='student'>Student (Learning Mode)</option>
                <option value='instructor'>Instructor (Teaching Mode)</option>
              </select>
            </div>

            <button type='submit' disabled={loading} className='btn-primary col-span-2 py-4 shadow-xl shadow-brand/20 font-black uppercase tracking-widest text-xs'>
              {loading ? 'Creating Your Account...' : 'Finish Registration'}
            </button>
          </form>

          <p className='text-center mt-10 text-xs text-neutral-400 font-bold'>
            Already a member? <Link to='/login' className='text-brand underline'>Log In</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;