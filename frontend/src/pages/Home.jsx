import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { subjectsApi } from '../lib/subjects';
import { AppShell } from '../components/Layout/AppShell';
import { Button, Spinner, Alert } from '../components/common/Button';
import { Search, BookOpen, ChevronRight } from 'lucide-react';

export function Home() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchSubjects();
  }, [pagination.page, searchQuery]);

  const fetchSubjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await subjectsApi.getSubjects({
        page: pagination.page,
        pageSize: pagination.pageSize,
        q: searchQuery || undefined,
      });
      setSubjects(data.subjects);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchSubjects();
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Our Courses
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our collection of subjects and start your learning journey today.
            Each course is structured with sequential videos to help you learn effectively.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input w-full pl-12 pr-4 py-3"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              Search
            </Button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner className="h-8 w-8 text-primary-600" />
          </div>
        ) : (
          <>
            {/* Subjects Grid */}
            {subjects.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No subjects found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject) => (
                  <Link
                    key={subject.id}
                    to={`/subjects/${subject.id}`}
                    className="card hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {subject.title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                          {subject.description || 'No description available'}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors flex-shrink-0 ml-2" />
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
