import { useEffect, useState } from 'react';
import { getBackendSrv } from '@grafana/runtime';
import { BookmarkedDashboard } from './navigation';

/**
 * Hook to fetch and manage user's starred/bookmarked dashboards
 *
 * This hook provides:
 * - List of bookmarked dashboards (starred in Grafana)
 * - Loading state
 * - Methods to add/remove bookmarks
 * - Refresh functionality
 */
export function useBookmarkedDashboards() {
  const [bookmarks, setBookmarks] = useState<BookmarkedDashboard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  /**
   * Fetch starred dashboards from Grafana API
   */
  const fetchBookmarks = async () => {
    try {
      setLoading(true);

      // Fetch starred dashboards from Grafana search API
      const response = await getBackendSrv().get('/api/search', {
        starred: true,
        limit: 20, // Limit bookmarks in sidebar to keep it clean
      });

      const dashboards: BookmarkedDashboard[] = response.map((item: any) => ({
        id: item.id,
        uid: item.uid,
        title: item.title,
        url: item.url,
        isStarred: true,
      }));

      setBookmarks(dashboards);
    } catch (error) {
      console.error('Failed to fetch bookmarked dashboards:', error);
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a dashboard to bookmarks (star it)
   */
  const addBookmark = async (dashboardUid: string) => {
    try {
      await getBackendSrv().post(`/api/dashboards/uid/${dashboardUid}/stars`);
      await fetchBookmarks(); // Refresh list
    } catch (error) {
      console.error('Failed to bookmark dashboard:', error);
    }
  };

  /**
   * Remove a dashboard from bookmarks (unstar it)
   */
  const removeBookmark = async (dashboardUid: string) => {
    try {
      await getBackendSrv().delete(`/api/dashboards/uid/${dashboardUid}/stars`);
      await fetchBookmarks(); // Refresh list
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
    }
  };

  return {
    bookmarks,
    loading,
    addBookmark,
    removeBookmark,
    refresh: fetchBookmarks,
  };
}
