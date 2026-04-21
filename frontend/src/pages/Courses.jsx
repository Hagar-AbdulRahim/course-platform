import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../store/slices/courseSlice';
import CourseCard from '../components/CourseCard';

const Courses = () => {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector(
    (state) => state.courses
  );
  const [keyword, setKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');


  const coreCategories = ['All', 'Web Development', 'Graphic Design', 'Marketing', 'Business'];

  useEffect(() => {
    dispatch(fetchCourses({ page: 1, keyword: '' }));
  }, [dispatch]);

  const filteredCourses = (courses || []).filter(c => {
    const matchesKeyword = c.title?.toLowerCase().includes(keyword.toLowerCase()) || 
                          c.description?.toLowerCase().includes(keyword.toLowerCase());
    const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
    return matchesKeyword && matchesCategory;
  });

  return (
    <div className='min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-12'>
      {/* Header Section */}
      <section className="bg-[#001f3f]/5 dark:bg-brand-900/10 py-10 mb-12 border-b border-neutral-100 dark:border-neutral-800">
        <div className='mx-auto max-w-7xl px-6'>
          <div className='flex flex-col gap-12'>
            <div className="reveal-anim active">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#001f3f] dark:text-brand mb-4 inline-block">Direct Access</span>
              <h2 className='text-4xl md:text-6xl font-black text-neutral-900 dark:text-white leading-tight'>
                Explore Our <br /> <span className="text-[#001f3f] dark:text-brand">Learning Ecosystem</span>
              </h2>
            </div>
            
            <div className='flex flex-col gap-10 reveal-anim active'>
               <div className="w-full max-w-xl">
                 <input
                   type='text'
                   value={keyword}
                   onChange={(e) => setKeyword(e.target.value)}
                   placeholder='Search courses by title or skill...'
                   className='navy-search'
                 />
               </div>

               <div className='grid grid-cols-1 md:grid-cols-4 gap-8 items-start'>
                  <div className='md:col-span-1 filter-sidebar space-y-10'>
                    <div className='space-y-6'>
                      <p className='text-[10px] font-black uppercase tracking-widest text-brand-200 opacity-50'>Categories</p>
                      <div className='flex flex-col gap-3'>
                          {coreCategories.map(cat => (
                            <button
                              key={cat}
                              onClick={() => setActiveCategory(cat)}
                              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all w-fit text-left ${activeCategory === cat
                                  ? 'bg-white text-[#001f3f] shadow-xl'
                                  : 'bg-white/5 text-white/40 border border-white/5 hover:border-white/20 hover:text-white'
                                }`}
                            >
                              {cat}
                            </button>
                          ))}
                      </div>
                    </div>

                   </div>

                  <div className='md:col-span-3'>
                    {loading ? (
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {[1,2,3,4,5,6].map(i => (
                          <div key={i} className="h-80 rounded-3xl bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
                        ))}
                      </div>
                    ) : (
                      <>
                        {error && <div className="p-4 bg-red-50 text-red-500 rounded-2xl mb-8 font-medium">Error: {error}</div>}

                        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 reveal-anim active'>
                          {filteredCourses.map((course) => (
                            <CourseCard key={course._id} course={course} />
                          ))}
                          {filteredCourses.length === 0 && !loading && (
                            <div className="col-span-full py-20 text-center text-neutral-500">
                              <p className="text-2xl font-bold mb-4">No courses found</p>
                              <button onClick={() => {setKeyword(''); setActiveCategory('All'); setMaxPrice(1000)}} className="text-brand font-bold hover:underline">Clear all filters</button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;
