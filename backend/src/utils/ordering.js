/**
 * Ordering and locking logic for videos within a subject
 * 
 * Global order: sections ordered by order_index, then videos by order_index within each section
 */

/**
 * Build a flattened list of videos in global order for a subject
 * @param {Array} sections - Array of sections with nested videos
 * @returns {Array} Flattened array of videos with section info
 */
function flattenVideoOrder(sections) {
  const flattened = [];
  
  // Sort sections by order_index
  const sortedSections = [...sections].sort((a, b) => a.order_index - b.order_index);
  
  for (const section of sortedSections) {
    // Sort videos by order_index within section
    const sortedVideos = [...(section.videos || [])].sort((a, b) => a.order_index - b.order_index);
    
    for (const video of sortedVideos) {
      flattened.push({
        ...video,
        section_id: section.id,
        section_title: section.title,
        section_order_index: section.order_index
      });
    }
  }
  
  return flattened;
}

/**
 * Get the previous video in the global sequence
 * @param {Array} flattenedVideos - Flattened video list
 * @param {number} currentVideoId - Current video ID
 * @returns {Object|null} Previous video or null if first
 */
function getPreviousVideo(flattenedVideos, currentVideoId) {
  const currentIndex = flattenedVideos.findIndex(v => v.id === currentVideoId);
  if (currentIndex <= 0) return null;
  return flattenedVideos[currentIndex - 1];
}

/**
 * Get the next video in the global sequence
 * @param {Array} flattenedVideos - Flattened video list
 * @param {number} currentVideoId - Current video ID
 * @returns {Object|null} Next video or null if last
 */
function getNextVideo(flattenedVideos, currentVideoId) {
  const currentIndex = flattenedVideos.findIndex(v => v.id === currentVideoId);
  if (currentIndex === -1 || currentIndex >= flattenedVideos.length - 1) return null;
  return flattenedVideos[currentIndex + 1];
}

/**
 * Get the prerequisite video for a given video
 * @param {Array} flattenedVideos - Flattened video list
 * @param {number} videoId - Video ID to check
 * @returns {Object|null} Prerequisite video or null if first
 */
function getPrerequisiteVideo(flattenedVideos, videoId) {
  return getPreviousVideo(flattenedVideos, videoId);
}

/**
 * Check if a video is unlocked based on progress
 * @param {Array} flattenedVideos - Flattened video list
 * @param {number} videoId - Video to check
 * @param {Set} completedVideoIds - Set of completed video IDs
 * @returns {Object} { locked: boolean, unlockReason: string|null }
 */
function isVideoUnlocked(flattenedVideos, videoId, completedVideoIds) {
  const prerequisite = getPrerequisiteVideo(flattenedVideos, videoId);
  
  // First video is always unlocked
  if (!prerequisite) {
    return { locked: false, unlockReason: null };
  }
  
  // Check if prerequisite is completed
  if (completedVideoIds.has(prerequisite.id)) {
    return { locked: false, unlockReason: null };
  }
  
  return { 
    locked: true, 
    unlockReason: `Complete "${prerequisite.title}" to unlock this video` 
  };
}

/**
 * Get the first unlocked video in a subject
 * @param {Array} flattenedVideos - Flattened video list
 * @param {Set} completedVideoIds - Set of completed video IDs
 * @returns {Object|null} First unlocked video or null
 */
function getFirstUnlockedVideo(flattenedVideos, completedVideoIds) {
  for (const video of flattenedVideos) {
    const { locked } = isVideoUnlocked(flattenedVideos, video.id, completedVideoIds);
    if (!locked) {
      return video;
    }
  }
  return null;
}

/**
 * Build subject tree with locking status for each video
 * @param {Array} sections - Sections with videos
 * @param {Set} completedVideoIds - Set of completed video IDs
 * @returns {Array} Sections with videos including locked status
 */
function buildSubjectTreeWithLocking(sections, completedVideoIds) {
  const flattened = flattenVideoOrder(sections);
  
  return sections
    .sort((a, b) => a.order_index - b.order_index)
    .map(section => ({
      ...section,
      videos: (section.videos || [])
        .sort((a, b) => a.order_index - b.order_index)
        .map(video => {
          const { locked, unlockReason } = isVideoUnlocked(flattened, video.id, completedVideoIds);
          return {
            ...video,
            is_completed: completedVideoIds.has(video.id),
            locked,
            unlock_reason: unlockReason
          };
        })
    }));
}

module.exports = {
  flattenVideoOrder,
  getPreviousVideo,
  getNextVideo,
  getPrerequisiteVideo,
  isVideoUnlocked,
  getFirstUnlockedVideo,
  buildSubjectTreeWithLocking
};
