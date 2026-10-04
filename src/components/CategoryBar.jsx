import { useNavigate } from 'react-router-dom';
import { categories } from '../data/categories';

function CategoryBar({ activeCategory = null }) {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/events?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="category-bar-section" aria-label="Browse by Category">
      <div className="category-bar-container">
        <div className="section-header-compact">
          <h2 className="section-title-sm">Explore by Category</h2>
          <span className="section-subtitle-sm">Find events tailored to your interests</span>
        </div>

        <div className="category-scroll-wrapper">
          <div className="category-grid">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-item-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(cat.name)}
                >
                  <span className="category-icon" aria-hidden="true">
                    {cat.icon}
                  </span>
                  <span className="category-name">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategoryBar;
