import { Search, Menu } from 'lucide-react';
import styles from './Header.module.css';

const Header = ({ searchQuery, onSearchChange, onMenuClick }) => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1 className={styles.logoTitle}>Dullstroom</h1>
        <span className={styles.logoSubtitle}>• DIGITAL •</span>
      </div>

      <div className={styles.searchContainer}>
        <Search size={20} color="#666" className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <button
        className={styles.menuButton}
        onClick={onMenuClick}
      >
        <Menu size={24} />
      </button>
    </header>
  );
};

export default Header;
