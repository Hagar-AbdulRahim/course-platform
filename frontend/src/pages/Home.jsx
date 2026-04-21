import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../store/slices/courseSlice';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { getFullUrl } from '../utils/urlHelper';

const Home = () => {
  const dispatch = useDispatch();
  const { courses, loading } = useSelector((state) => state.courses);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState(1000);
  const sliderRef = useRef(null);

  const coreCategories = ['All', 'Web Development', 'Graphic Design', 'Marketing', 'Business'];

  useEffect(() => {
    dispatch(fetchCourses({ page: 1, keyword: '' }));
  }, [dispatch]);

  const filteredCourses = (courses || []).filter(course => {
    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = (course.price || 0) <= maxPrice;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 350;
      sliderRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className='flex flex-col gap-24 pb-20'>
      {/* Hero Section */}
      <section className='relative pt-6 lg:pt-10'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          <div className='reveal-anim active flex flex-col gap-8'>


            <h1 className='leading-tight tracking-tight text-neutral-900 dark:text-white'>
              Develop your skills <br />
              <span className='text-[#001f3f] dark:text-brand underline decoration-brand/30'>without limits</span> and <br />
              grow your career
            </h1>

            <p className='text-neutral-500 text-sm max-w-lg leading-relaxed'>
              Join over 10,000+ students and professionals worldwide learning from the best instructors.
              Get access to premium courses with certificates and real-world projects.
            </p>

            <div className='flex flex-wrap gap-4 pt-4'>
              <Link to='/courses' className='btn-primary px-10 py-4 text-sm'>
                Discover Bootcamps
              </Link>
              <Link to='/register' className='btn-secondary px-10 py-4 text-sm'>
                Free Register
              </Link>
            </div>
          </div>

          <div className='relative reveal-anim active h-[500px]' style={{ transitionDelay: '0.2s' }}>
            <div className='absolute inset-0 bg-brand/10 rounded-[100px] transform rotate-6 scale-90 translate-x-10'></div>
            <img
              src={getFullUrl('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=1000&fit=crop&q=90')}
              alt='hero'
              className='w-full h-full object-cover rounded-[100px] shadow-2xl relative z-10 hover:scale-[1.02] transition-transform duration-700'
            />

            <div className='absolute -bottom-10 -left-10 bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl z-20 animate-float'>
              <p className='text-[10px] font-black text-[#001f3f] dark:text-brand mb-1'>ACTIVE STUDENTS</p>
              <p className='text-3xl font-black text-neutral-800 dark:text-white'>10K+</p>
            </div>

            <div className='absolute top-20 -right-10 glass p-5 rounded-3xl shadow-xl z-20 animate-float' style={{ animationDelay: '1s' }}>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-[10px] font-black text-white shadow-lg'>TOP</div>
                <div>
                  <p className='text-[10px] font-black text-neutral-400'>TOP RATING</p>
                  <p className='text-lg font-black text-neutral-800 dark:text-white'>4.9 / 5.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Filter Section */}
      <section className='reveal-anim active'>
        <div className='flex flex-col gap-12'>
          <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
            <div>
              <h2 className='font-heading text-neutral-900 dark:text-white'>Favorite Courses</h2>
            </div>

            {/* Search Input on the Left of the Filter Row */}
            <div className='w-full max-w-md'>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='navy-search'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-4 gap-12 items-start pb-20 border-b border-neutral-100 dark:border-neutral-800'>
            {/* Left Column: Categories and Price in a Navy Sidebar */}
            <div className='lg:col-span-1 filter-sidebar space-y-12'>
              <div className='space-y-6'>
                <p className='text-[11px] font-black uppercase tracking-[0.3em] text-brand-300 opacity-60'>Categories</p>
                <div className='flex flex-col gap-3'>
                  {coreCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all w-fit text-left ${activeCategory === cat
                        ? 'bg-white text-[#001f3f] shadow-xl'
                        : 'bg-white/5 text-white/50 border border-white/10 hover:border-white/30 hover:text-white'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className='space-y-8'>
                <div className='flex justify-between items-center'>
                  <p className='text-[11px] font-black uppercase tracking-[0.3em] text-brand-300 opacity-60'>Price Range</p>
                  <span className='text-xs font-black text-white'>${maxPrice}</span>
                </div>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className='w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white'
                  />
                  <div className='flex justify-between mt-4 text-[9px] font-bold text-white/30 uppercase tracking-widest'>
                    <span>$0</span>
                    <span>$1000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Slider */}
            <div className='lg:col-span-3 pt-6'>
              <div className='flex items-center justify-between mb-10'>
                <p className='text-xs font-black uppercase tracking-widest text-neutral-400'>{filteredCourses.length} Learning Paths Found</p>
                <div className='flex gap-2'>
                  <button onClick={() => scrollSlider('left')} className='w-10 h-10 rounded-xl border border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:bg-[#001f3f] hover:text-white transition-all'>←</button>
                  <button onClick={() => scrollSlider('right')} className='w-10 h-10 rounded-xl border border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:bg-[#001f3f] hover:text-white transition-all'>→</button>
                </div>
              </div>

              <div ref={sliderRef} className='course-slider gap-6 pb-6'>
                {loading ? (
                  [1, 2, 3].map(i => <div key={i} className="min-w-[320px] h-96 bg-neutral-100 dark:bg-neutral-800 rounded-3xl animate-pulse"></div>)
                ) : (
                  <>
                    {filteredCourses.length === 0 ? (
                      <div className='w-full py-20 text-center text-neutral-400 italic text-sm'>No courses match your filters...</div>
                    ) : (
                      filteredCourses.map((course) => (
                        <div key={course._id} className="min-w-[320px]">
                          <CourseCard course={course} />
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Why Section */}
      <section className='reveal-anim active'>
        <div className='card bg-neutral-900 border-none p-12 md:p-20 flex flex-col items-center text-center'>
          <h2 className='text-white max-w-2xl mb-8'>Join a community that helps <br /> you grow your real potential</h2>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-20 w-full mt-10'>
            {[
              { val: '25K+', label: 'Happy Students' },
              { val: '120+', label: 'Expert Mentors' },
              { val: '650+', label: 'HD Courses' },
              { val: '98%', label: 'Job Success Rate' }
            ].map(s => (
              <div key={s.label}>
                <p className='text-4xl font-black text-brand mb-2'>{s.val}</p>
                <p className='text-[10px] uppercase font-bold text-neutral-400 tracking-widest'>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
