import { Link } from 'react-router-dom';
import { getFullUrl } from '../utils/urlHelper';

const CourseCard = ({ course }) => {
  return (
    <div className='group card h-full flex flex-col p-3 bg-white dark:bg-neutral-800 shadow-sm hover:shadow-2xl hover:shadow-brand/5 border-neutral-100 transition-all duration-500'>
      {/* Thumbnail */}
      <div className='relative aspect-[4/3] rounded-xl overflow-hidden'>
        <img
          src={getFullUrl(course.thumbnail) || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'}
          alt={course.title}
          className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity'></div>

        {/* Category Badge */}
        <div className='absolute top-3 left-3 glass px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-brand'>
          {course.category}
        </div>
      </div>

      {/* Content */}
      <div className='p-4 flex flex-col flex-1'>

        <h3 className='text-sm font-bold mb-2 font-heading leading-tight line-clamp-2 min-h-[40px] group-hover:text-brand transition-colors'>
          {course.title}
        </h3>

        <p className='text-[11px] text-neutral-400 mb-6 line-clamp-2 flex-1'>
          {course.description}
        </p>

        <div className='flex items-center justify-between mt-auto pt-4 border-t border-neutral-50 dark:border-neutral-700'>
          <div className='flex flex-col'>
            <span className='text-[10px] font-bold text-neutral-400 line-through'>$120.00</span>
            <span className='text-lg font-black text-brand'>${course.price}</span>
          </div>
          <Link
            to={`/courses/${course._id}`}
            className='btn-primary px-5 py-2 text-[10px] uppercase tracking-widest'
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
