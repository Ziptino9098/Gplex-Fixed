// ---- templates: the markup Gplex adds to V3's pages (StarTube 2.7's, cleaned; icon pairs keep its
// st-svg convention: .filled-icon for the Material icons, .outline-icon for the 2017+ outlines, the
// stylesheet shows one). {{name}} placeholders are filled by fill().
const T = {
    svg: `<div class="filled-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
<div class="outline-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>`,
    svgToggle: `<div class="filled-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
<div class="outline-icon">
    <div class="regular-icon">
        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
            <g>
                <path>
                </path>
            </g>
        </svg>
    </div>
    <div class="active-icon">
        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
            <g>
                <path>
                </path>
            </g>
        </svg>
    </div>
</div>`,
    button: `<button class="st-btn yt-uix-tooltip flex-bar">
    <div class="st-btn-icon">
        <div class="st-svg">
        </div>
    </div>
    <span class="st-btn-text"></span>
    <div class="st-btn-icon st-btn-after-icon hid">
        <div class="st-svg">
        </div>
    </div>
</button>`,
    rows: {
        aboveTitle: `<div id="st-above-title-row" class="st-watch-row">
                    <div class="st-title st-title">
                    </div>
                </div>`,
        aboveOwner: `<div id="st-above-owner-row" class="st-watch-row">
                    <div class="st-owner flex-bar">
                        <a class="st-pfp stx-link" stx-ep="browse">
                            <img></img>
                        </a>
                        <div class="st-owner-info">
                            <div class="st-owner-title flex-bar">
                                <div class="st-owner-name"></div>
                                <span class="st-owner-icon"></span>
                                <a class="st-video-count st-video-count-link hid stx-link" stx-ep="browse" stx-params="EgZ2aWRlb3PyBgQKAjoA"></a>
                            </div>
                            <div class="st-owner-subtitle none">
                                <span class="st-sub-count"></span>
                                <span class="st-pub-date none"></span>
                                <a class="st-video-count-link none stx-link" stx-ep="browse" stx-params="EgZ2aWRlb3PyBgQKAjoA"></a>
                            </div>
                        </div>
                        <div class="st-sub-button">
                        </div>
                        <div class="st-videos-button">
                            <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default st-video-dd-trigger" disabled id="watch5-videos-dd-button">
                        <span class="yt-uix-button-content">
                            <span class="run st-video-count">No videos</span>
                        </span>
                        <span class="yt-uix-button-icon-wrapper">
                            <img src="https://s.ytimg.com/yts/img/pixel-vfl3z5WfW.gif" class="yt-uix-button-icon yt-uix-button-arrow">
                        </span>
                    </button>
                        </div>
                    </div>
                </div>`,
        aboveVideos: `<div id="st-above-videos-row" class="st-watch-row">
<div id="watch5-videos-dd" page="1" max-pages="5" class="hid">
            <div id="watch5-videos-dd-inner" class="flex-bar">
                <div id="videos-dd-left" class="videos-dd-arrow">
                    <button id="videos-dd-prev" class="yt-uix-button yt-uix-button-default yt-uix-slider-prev" disabled rel="prev">
                        <img class="yt-uix-slider-prev-arrow" src="">
                    </button>
                </div>
                <div id="videos-dd-center">
                    <div id="videos-dd-top" class="flex-bar">
                        <a id="videos-dd-link" class="st-video-count-link stx-link" stx-ep="browse" stx-params="EgZ2aWRlb3PyBgQKAjoA">
                            <span>See all </span>
                            <span id="videos-dd-count" class="st-video-count">videos</span>
                            <span> »</span>
                        </a>
                        <div id="videos-dd-pagination">
                            <button id="videos-dd-p1" page="1" class="yt-uix-button yt-uix-button-size-default yt-uix-button-toggled yt-uix-button-default yt-uix-pager-button">
                                <span class="yt-uix-button-content">
                                    <span class="run">1</span>
                               </span>
                            </button>
                            <button id="videos-dd-p2" page="2" class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-pager-button hid">
                                <span class="yt-uix-button-content">
                                    <span class="run">2</span>
                                </span>
                            </button>
                            <button id="videos-dd-p3" page="3" class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-pager-button hid">
                                <span class="yt-uix-button-content">
                                    <span class="run">3</span>
                                </span>
                            </button>
                            <button id="videos-dd-p4" page="4" class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-pager-button hid">
                                <span class="yt-uix-button-content">
                                    <span class="run">4</span>
                                </span>
                            </button>
                            <button id="videos-dd-p5" page="5" class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-pager-button hid">
                                <span class="yt-uix-button-content">
                                    <span class="run">5</span>
                                </span>
                            </button>
                        </div>
                    </div>
                    <div id="videos-dd-main" class="flex-bar">
                        <div id="videos-dd-content" class="flex">
                        </div>
                    </div>
                </div>
                <div id="videos-dd-right" class="videos-dd-arrow">
                    <button id="videos-dd-next" class="yt-uix-button yt-uix-button-default yt-uix-slider-next" rel="next">
                        <img class="yt-uix-slider-next-arrow" src="">
                    </button>
                </div>
            </div>
        </div>
        </div>`,
        ratingsInfo: `<div id="st-ratings-info-row" class="st-stargazer-row st-ri-row st-watch-row flex-bar">
                    <div class="st-star-ratings flex-bar">
                        <span class="st-ratings-before-text">Rate: </span>
                        <div class="st-stars flex-bar">
                            <div class="st-stars-fence hid">
                            </div>
                            <div class="st-stars-object flex-bar">
                                <button id="st-star-1" class="st-star" stars="1" sent="dislike">
                                </button>
                                <button id="st-star-2" class="st-star" stars="2" sent="dislike">
                                </button>
                                <button id="st-star-3" class="st-star" stars="3" sent="like">
                                </button>
                                <button id="st-star-4" class="st-star" stars="4" sent="like">
                                </button>
                                <button id="st-star-5" class="st-star" stars="5" sent="like">
                                </button>
                            </div>
                            <div class="st-stars-text flex-bar">
                                <div class="st-stars-rating-count yt-uix-tooltip">
                                    <span class="st-rating-count"></span>
                                    <span> ratings</span>
                                </div>
                                <div class="st-stars-rating-text">
                                    <span class="st-star-rating"></span>
                                </div>
                                <div class="st-stars-your-rating">
                                    <span>Your rating: </span>
                                    <span class="st-your-star-rating"></span>
                                </div>
                            </div>
                        </div>
                        <div class="st-ltod">
                            <div class="st-ltod-buttons">
                            </div>
                            <div class="st-ltod-bar">
                            </div>
                        </div>
                    </div>
                    <div class="st-views-info">
                        <div class="st-fancy-view-count">
                            <span class="st-views-before-text">Views: </span>
                            <span class="st-view-count"></span>
                            <span class="st-views-string"> views</span>
                        </div>
                    </div>
                </div>`,
        watchTabs: `<div id="st-watch-tabs-row" class="st-watch-row">
   <div class="st-watch-tabs-list flex-bar">
       <button id="st-video-info-button" class="st-watch-tab st-watch-trigger st-tab-trigger none" trigger="video-info">
           <div class="st-watch-tab-inner flex-bar">
               <div class="st-watch-tab-icon"></div>
               <span>Info</span>
           </div>
           <div class="st-watch-tab-arrow"></div>
       </button>
       <button id="st-share-tab" class="st-watch-tab st-watch-trigger st-tab-trigger active" trigger="share">
           <div class="st-watch-tab-inner flex-bar">
               <div class="st-watch-tab-icon"></div>
               <span>Share</span>
           </div>
           <div class="st-watch-tab-arrow"></div>
       </button>
       <button id="st-favorite-button" class="st-watch-tab st-watch-trigger st-tab-trigger" trigger="favorite">
           <div class="st-watch-tab-inner flex-bar">
               <div class="st-watch-tab-icon"></div>
               <span>Favorite</span>
           </div>
           <div class="st-watch-tab-arrow"></div>
       </button>
       <button id="st-addto-button" class="st-watch-tab st-watch-trigger st-tab-trigger" trigger="addto">
           <div class="st-watch-tab-inner flex-bar">
               <div class="st-watch-tab-icon"></div>
               <span>Playlists</span>
           </div>
           <div class="st-watch-tab-arrow"></div>
       </button>
       <button id="st-report-button" class="st-watch-tab st-watch-trigger st-tab-trigger" trigger="report">
           <div class="st-watch-tab-inner flex-bar">
               <div class="st-watch-tab-icon"></div>
               <span>Flag</span>
           </div>
           <div class="st-watch-tab-arrow"></div>
       </button>
   </div>
   <div class="st-watch-tabs-content flex-bar">
       <div id="st-watch-tab-info" class="st-watch-tab-content none">
           <div class="st-watch-tab-content-inner st-video-info-content">
           </div>
       </div>
       <div id="st-watch-tab-share" class="st-watch-tab-content">
           <div class="st-watch-tab-content-inner st-share-content">
           </div>
       </div>
       <div id="st-watch-tab-favorite" class="st-watch-tab-content">
           <div class="st-watch-tab-content-inner st-favorite-content">
               <span id="st-joke-message" class="yt-uix-tooltip" data-tooltip-text="Feature is never coming.">Sit tight! Feature is coming soon™</span>
           </div>
       </div>
       <div id="st-watch-tab-addto" class="st-watch-tab-content">
           <div class="st-watch-tab-content-inner st-addto-content">
           </div>
       </div>
       <div id="st-watch-tab-flag" class="st-watch-tab-content">
           <div class="st-watch-tab-content-inner st-report-content">
           </div>
       </div>
   </div>
</div>`,
        belowTitle: `<div id="st-below-title-row" class="st-watch-row">
                    <div class="st-title st-title">
                    </div>
                </div>`,
        descActions: `<div id="st-desc-actions-row" class="st-watch-row st-watch-row-no-padding flex polymer-row st-show-svgs st-wmr-row">
                    <div class="st-desc">
                        <div class="st-desc-views-info st-views-info flex-bar">
                            <span class="st-view-count"></span>
                            <span class="st-short-view-count"></span>
                            <span class="st-dot">•</span>
                            <span class="st-pub-date"></span>
                            <span class="st-upload-date"></span>
                            <span class="st-relative-date"></span>
                        </div>
                        <div class="st-desc-content">
                        </div>
                    </div>
                    <div class="st-actions-container">
                        <div class="st-actions flex-bar">
                            <div class="st-ltod">
                                <div class="st-ltod-buttons">
                                </div>
                                <div class="st-ltod-bar">
                                </div>
                            </div>
                            <div class="st-action-buttons st-polymer-actions flex-bar">
                                <div class="st-addto-button-holder st-contents">
                                </div>
                                <div class="st-share-button-holder st-contents">
                                </div>
                                <div class="st-save-button-holder st-contents">
                                </div>
                                <div class="st-transcript-button-holder st-contents hid">
                                </div>
                                <div class="st-report-button-holder st-contents hid">
                                </div>
                                <div class="st-more-button-holder st-contents">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,
        actionsInfo: `<div id="st-actions-info-row" class="st-watch-row flex-bar aozora-row">
                    <div class="st-actions flex-bar">
                        <div class="st-ltod">
                            <div class="st-ltod-buttons">
                            </div>
                        </div>
                        <div class="st-action-buttons flex-bar">
                            <div class="st-addto-button-holder st-contents">
                            </div>
                            <div class="st-share-button-holder st-contents">
                            </div>
                            <div class="st-transcript-button-holder st-contents">
                            </div>
                            <div class="st-report-button-holder st-contents">
                            </div>
                        </div>
                    </div>
                    <div class="st-views-info">
                        <span class="st-view-count"></span>
                        <span class="st-short-view-count"></span>
                        <span class="st-dot">•</span>
                        <span class="st-pub-date"></span>
                        <span class="st-upload-date"></span>
                        <span class="st-relative-date"></span>
                    </div>
                    <div class="st-stats-button-holder st-contents">
                    </div>
                </div>`,
        infoActions: `<div id="st-info-actions-row" class="st-watch-row flex-bar polymer-row st-show-svgs">
                   <div class="st-views-info">
                        <span class="st-view-count"></span>
                        <span class="st-short-view-count none"></span>
                        <span class="st-dot">•</span>
                        <span class="st-upload-date"></span>
                        <span class="st-relative-date none"></span>
                    </div>
                    <div class="st-actions flex-bar">
                        <div class="st-ltod">
                            <div class="st-ltod-buttons">
                            </div>
                            <div class="st-ltod-bar">
                            </div>
                        </div>
                        <div class="st-action-buttons st-polymer-actions flex-bar">
                            <div class="st-addto-button-holder st-contents">
                            </div>
                            <div class="st-share-button-holder st-contents">
                            </div>
                            <div class="st-save-button-holder st-contents">
                            </div>
                            <div class="st-more-button-holder st-contents">
                            </div>
                        </div>
                    </div>
                </div>`,
        owner: `<div id="st-owner-row" class="st-watch-row flex-bar polymer-row">
                    <div class="st-owner st-polymer-owner flex-bar">
<a class="st-pfp stx-link" stx-ep="browse">
                            <img></img>
                        </a>
                        <div class="st-owner-info">
                            <div class="st-owner-title flex-bar">
                                <span class="st-owner-from st-owner-before-text hid">From: </span>
                                <span class="st-owner-name"></span>
                                <a class="st-owner-handle stx-link" stx-ep="browse"></a>
                                <span class="st-owner-icon"></span>
                                <a class="st-video-count st-video-count-link stx-link" stx-ep="browse" stx-params="EgZ2aWRlb3PyBgQKAjoA"></a>
                            </div>
                            <div class="st-owner-subtitle">
                                <span class="st-sub-count"></span>
                                <span class="st-pub-date"></span>
                                <a class="st-video-count-link st-video-count stx-link" stx-ep="browse" stx-params="EgZ2aWRlb3PyBgQKAjoA"></a>
                            </div>
                        </div>
                         <div class="st-sub-area st-sub-button">
                            </div>
                         <div class="st-sub-area st-owner-buttons flex-bar">
                             <a id="st-analytics" class="st-poly-btn flex-bar">
                                 <span>Analytics</span>
                             </a>
                             <a id="st-edit-vid" class="st-poly-btn flex-bar">
                                 <span>Edit video</span>
                             </a>
                         </div>
</div>
                </div>`,
        ownerTeaser: `<div id="st-owner-teaser-row" class="st-watch-row st-watch-row-no-padding flex polymer-row st-show-svgs st-wmr-row">
                    <div class="st-owner st-polymer-owner flex-bar">
<a class="st-pfp stx-link" stx-ep="browse">
                            <img></img>
                        </a>
                        <div class="st-owner-info">
                            <div class="st-owner-title flex-bar">
                                <span class="st-owner-from st-owner-before-text hid">From: </span>
                                <span class="st-owner-name"></span>
                                <a class="st-owner-handle stx-link" stx-ep="browse"></a>
                                <span class="st-owner-icon"></span>
                                <a class="st-video-count st-video-count-link stx-link" stx-ep="browse" stx-params="EgZ2aWRlb3PyBgQKAjoA"></a>
                            </div>
                            <div class="st-owner-subtitle">
                                <span class="st-sub-count"></span>
                                <span class="st-pub-date"></span>
                                <a class="st-video-count-link st-video-count stx-link" stx-ep="browse" stx-params="EgZ2aWRlb3PyBgQKAjoA"></a>
                            </div>
                        </div>
                         <div class="st-sub-area st-sub-button">
                            </div>
                         <div class="st-sub-area st-owner-buttons flex-bar">
                             <a id="st-analytics" class="st-poly-btn flex-bar">
                                 <span>Analytics</span>
                             </a>
                             <a id="st-edit-vid" class="st-poly-btn flex-bar">
                                 <span>Edit video</span>
                             </a>
                         </div>
</div>
                    <div class="st-teaser">
                        <div class="st-comment-teaser">
                            <div class="st-comment-teaser-inner">
                                <div class="st-teaser-header">
                                    <span class="st-comments-text">Comments</span>
                                    <span class="st-comment-count"></span>
                                </div>
                                <div class="st-teaser-content flex-bar">
                                    <div class="st-teaser-comment flex-bar">
                                        <div class="st-teaser-pfp">
                                            <img class="st-comment-teaser-pfp"></img>
                                        </div>
                                        <div class="st-teaser-comment-text">
                                            <span></span>
                                        </div>
                                    </div>
                                    <div class="st-teaser-fake-box flex-bar">
                                        <div class="st-teaser-pfp">
                                            <img class="st-your-pfp"></img>
                                        </div>
                                        <div class="st-teaser-box">
                                            <span>Add a comment...</span>
                                        </div>
                                    </div>
                                    <div class="st-teaser-chevron">
                                        <div class="st-svg">
<div class="filled-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
<div class="outline-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,
        ownerInfo: `<div id="st-owner-info-row" class="st-watch-row flex hitchhiker-row polymer-row st-show-svgs">
                    <div class="st-owner flex-bar">
<a class="st-pfp stx-link" stx-ep="browse">
                            <img></img>
                        </a>
                        <div class="st-owner-info">
                            <div class="st-owner-title">
                                <span class="st-owner-from st-owner-before-text hid">From: </span>
                                <span class="st-owner-name"></span>
                                <a class="st-owner-name-spec hid stx-link" stx-ep="browse"></a>
                                <span class="st-owner-icon"></span>
                                <a class="st-video-count st-video-count-link stx-link" stx-ep="browse" stx-params="EgZ2aWRlb3PyBgQKAjoA"></a>
                            </div>
                            <div class="st-owner-subtitle">
                                <span class="st-sub-count"></span>
                                <span class="st-pub-date hid"></span>
                                <span class="st-joined-text st-owner-before-text hid">Joined: </span>
                                <span class="st-join-date hid"></span>
                                <span class="st-upload-date hid"></span>
                                <div class="st-owner-vid-part">
                                    <span class="st-videos-before-text st-owner-before-text hid">Videos: </span>
                                    <a class="st-video-count-link st-video-count hid stx-link" stx-ep="browse" stx-params="EgZ2aWRlb3PyBgQKAjoA"></a>
                                    <a class="st-video-count-link st-short-video-count hid stx-link" stx-ep="browse" stx-params="EgZ2aWRlb3PyBgQKAjoA"></a>
                                </div>
                            </div>
                            <div class="st-owner-desc-sub-expander-outer flex-bar">
                                <div class="st-owner-subsubtitle">
                                    <span class="st-added-text st-owner-before-text hid">Added: </span>
                                    <span class="st-upload-date hid"></span>
                                </div>
                            <div class="st-owner-desc-expander hid">
                                <span>(</span>
                                <button>
                                <span class="st-show-more">more info</span>
                                <span class="st-show-less">less info</span>
                                </button>
                                <span>)</span>
                            </div>
                            </div>
                            <div class="st-sub-button">
                            </div>
                        </div>
</div>
                    <div class="st-views-info">
                        <span class="st-view-count"></span>
                        <div class="st-ltod-bar">
                        </div>
                    </div>
                </div>`,
        actions: `<div id="st-actions-row" class="st-watch-row flex-bar hitchhiker-row startube-hide-svgs">
                    <div class="st-actions flex-bar">
                        <div class="st-action-buttons flex-bar">
                            <div class="st-addto-button-holder st-contents">
                            </div>
                            <div class="st-share-button-holder st-contents">
                            </div>
                            <div class="st-save-button-holder st-contents">
                            </div>
                            <div class="st-transcript-button-holder st-contents">
                            </div>
                            <div class="st-stats-button-holder st-contents">
                            </div>
                            <div class="st-report-button-holder st-contents">
                            </div>
                            <div class="st-more-button-holder st-contents">
                            </div>
                        </div>
                        <div class="st-ltod">
                            <div class="st-ltod-buttons">
                            </div>
                        </div>
                    </div>
                </div>`,
        desc: `<div id="st-desc-row" class="st-watch-row st-watch-row-no-padding flex-bar">
                    <div class="st-desc">
                        <div class="st-desc-views-info st-watch10-views-info st-views-info flex-bar yt-uix-tooltip">
                            <span class="st-view-count"></span>
                            <span class="st-short-view-count"></span>
                            <span class="st-dot">•</span>
                            <span class="st-pub-date"></span>
                            <span class="st-upload-date"></span>
                            <span class="st-relative-date"></span>
                        </div>
                        <div class="st-desc-views-info st-watch5-upload-info st-fancy-upload-date">
                            <b id="first-part">
                                <span>Uploaded by </span>
                                <a class="st-owner-name-spec stx-link" stx-ep="browse"></a>
                                <span>on </span>
                            </b>
                            <b id="second-part">
                                <span class="st-upload-date"></span>
                            </b>
                            <b id="third-part">
                                <span>by </span>
                                <a class="st-owner-name-spec stx-link" stx-ep="browse"></a>
                            </b>
                            <div class="st-ltod-bar st-right-ltod">
                            </div>
                        </div>
                        <div class="st-desc-content">
                            <div class="st-watch-extras">
                            </div>
                        </div>
                    </div>
                </div>`,
        extras: `<div id="st-extras-row" class="flex-bar st-watch-row">
                    <div class="st-extras">
                    </div>
                </div>`,
        floaters: `<div id="st-floaters-row" class="flex-bar">
                    <div class="st-floaters">
                        <div class="st-floater-fence"></div>
                        <div class="st-floater st-addto-floater st-addto-content">
                        </div>
                        <div class="st-floater st-more-floater st-more-content">
                            <div class="st-floater-inner">
                                <button class="st-report-trigger-2 st-floater-menuitem flex-bar">
                                    <div class="st-floater-icon">
                                        <div class="st-svg">
<div class="filled-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
<div class="outline-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
</div>
                                    </div>
                                    <div class="st-floater-text">
                                        <span>Report</span>
                                    </div>
                                </button>
                                <button class="st-stats-trigger-2 st-floater-menuitem flex-bar">
                                    <div class="st-floater-icon">
                                        <div class="st-svg">
<div class="filled-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
<div class="outline-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
</div>
                                    </div>
                                    <div class="st-floater-text">
                                        <span>Statistics</span>
                                    </div>
                                </button>
                                <button class="st-transcript-trigger-2 st-floater-menuitem flex-bar">
                                    <div class="st-floater-icon">
                                        <div class="st-svg">
<div class="filled-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
<div class="outline-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
</div>
                                    </div>
                                    <div class="st-floater-text">
                                        <span>Transcript</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`,
        panels: `<div id="st-panels-row" class="flex-bar st-watch-row">
                    <div class="st-panels">
                        <div class="st-panel st-share-panel st-share-content">
                        </div>
                        <div class="st-panel st-addto-panel st-addto-content">
                        </div>
                        <div class="st-panel st-transcript-panel st-transcript-content">
                        </div>
                        <div class="st-panel st-stats-panel st-stats-content">
                        </div>
                        <div class="st-panel st-report-panel st-report-content">
                        </div>
                    </div>
                    <button class="st-panel-close">
                        <div class="st-icon"></div>
                    </button>
                </div>`,
        sideBanner: `<div id="st-side-banner-row" class="st-watch-row flex-bar">
    <div class="related-channel">
<div class="related-banner">
    <a class="related-banner-pfp st-pfp stx-link" stx-ep="browse">
        <img></img>
    </a>
    <div class="related-banner-bg">
        <img class="st-banner"></img>
    </div>
</div>
</div>
</div>`,
        sideOwner: `<div id="st-side-owner-row" class="st-watch-row flex-bar">
    <div class="st-owner flex-bar">
<a class="st-pfp stx-link" stx-ep="browse">
                            <img></img>
                        </a>
                        <div class="st-owner-info">
                            <div class="st-owner-title">
                                <span class="st-owner-from st-owner-before-text hid">From: </span>
                                <span class="st-owner-name"></span>
                                <a class="st-owner-name-spec hid stx-link" stx-ep="browse"></a>
                                <span class="st-owner-icon"></span>
                                <a class="st-video-count st-video-count-link stx-link" stx-ep="browse" stx-params="EgZ2aWRlb3PyBgQKAjoA"></a>
                            </div>
                            <div class="st-owner-subtitle">
                                <span class="st-sub-count"></span>
                                <span class="st-pub-date hid"></span>
                                <span class="st-joined-text st-owner-before-text hid">Joined: </span>
                                <span class="st-join-date hid"></span>
                                <span class="st-upload-date hid"></span>
                                <div class="st-owner-vid-part">
                                    <span class="st-videos-before-text st-owner-before-text hid">Videos: </span>
                                    <a class="st-video-count-link st-video-count hid stx-link" stx-ep="browse" stx-params="EgZ2aWRlb3PyBgQKAjoA"></a>
                                    <a class="st-video-count-link st-short-video-count hid stx-link" stx-ep="browse" stx-params="EgZ2aWRlb3PyBgQKAjoA"></a>
                                </div>
                            </div>
                            <div class="st-owner-desc-sub-expander-outer flex-bar">
                                <div class="st-owner-subsubtitle">
                                    <span class="st-added-text st-owner-before-text hid">Added: </span>
                                    <span class="st-upload-date hid"></span>
                                </div>
                            <div class="st-owner-desc-expander hid">
                                <span>(</span>
                                <button>
                                <span class="st-show-more">more info</span>
                                <span class="st-show-less">less info</span>
                                </button>
                                <span>)</span>
                            </div>
                            </div>
                            <div class="st-sub-button">
                            </div>
                        </div>
</div>
</div>`,
        sideDesc: `<div id="st-side-desc-row" class="st-watch-row">
    <div class="st-desc">
        <div class="st-desc-content">
        </div>
    </div>
    <div class="st-url-options">
        <div id="st-url" class="st-url-option">
            <form action="" name="urlForm" id="urlForm">
                <label for="watch-url-field">URL</label>
                <input name="video_link" id="watch-url-field" type="text" class="email-video-url" readonly="">
                <div class="clearL"></div>
            </form>
        </div>
    </div>
</div>`,
        sidePanels: `<div id="st-side-panels-row" class="st-watch-row flex">
  <div id="st-videos-panel" class="watch-sidebar-section st-expandable-panel st-side-panel st-scrollable-panel new">
    <button class="st-side-panel-expander flex-bar">
      <span class="st-side-panel-icon">
        <div class="st-svg">
<div class="filled-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
<div class="outline-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
</div>
      </span>
      <span class="st-owner-name-before-text">More From: </span>
      <span class="st-owner-name-text"></span>
    </button>
    <div class="st-side-panel-inner">
      <div class="st-side-panel-page-header">
        <h4 class="watch-sidebar-head">Uploads</h4>
        <div id="related-tabs-sort">
          <button id="related-tabs-sort-btn" class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button yt-uix-button-default yt-uix-button-size-small multistate-handler" state="newest">
            <span class="yt-uix-button-content">
              <span class="run" state-id="newest">Newest</span>
              <span class="run" state-id="popular">Most popular</span>
              <span class="run" state-id="oldest">Oldest</span>
            </span>
            <img class="yt-uix-button-arrow" src="//s.ytimg.com/yts/img/pixel-vfl3z5WfW.gif">
          </button>
          <ul id="related-tabs-filter-menu" class="yt-uix-button-menu yt-uix-button-menu-default goog-scrollbar rev-multistate-handler hid" state="newest" role="menu" aria-haspopup="true">
            <li id="related-tabs-newest" role="menuitem" class="multistate" state-id="newest">
              <span class="yt-uix-button-menu-item">Newest</span>
            </li>
            <li id="related-tabs-popular" role="menuitem" class="multistate" state-id="popular">
              <span class="yt-uix-button-menu-item">Most popular</span>
            </li>
            <li id="related-tabs-oldest" role="menuitem" class="multistate" state-id="oldest">
              <span class="yt-uix-button-menu-item">Oldest</span>
            </li>
          </ul>
        </div>
        <div id="related-tabs-sort-fence" class="hid st-fence"></div>
      </div>
      <div class="watch-sidebar-body">
        <div id="related-tabs-loading" class="action-panel-loading hid">
          <p class="yt-spinner">
            <img class="yt-spinner-img" src="//s.ytimg.com/yts/img/pixel-vfl3z5WfW.gif">
            <span class="yt-spinner-message">Loading...</span>
          </p>
        </div>
        <ul id="watch-channel-videos" class="video-list"></ul>
      </div>
    </div>
  </div>
  <div id="st-about-panel" class="watch-sidebar-section st-expandable-panel st-scrollable-panel st-side-panel new">
    <button class="st-side-panel-expander flex-bar">
      <span class="st-side-panel-icon">
        <div class="st-svg">
<div class="filled-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
<div class="outline-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
</div>
      </span>
      <span>About </span>
      <span class="st-owner-name-text"></span>
    </button>
    <div class="st-side-panel-inner">
      <h4 class="watch-sidebar-head">About</h4>
      <div class="watch-sidebar-body">
        <div id="watch-channel-about">
          <div id="c4-about-tab">
            <div class="about-description">
              <span class="st-channel-desc"></span>
            </div>
            <div class="about-stats">
              <div class="about-stat" id="subs">
                <div class="about-stat-value">
                  <span class="st-channel-sub-count"></span>
                </div>
                <span> subscribers</span>
              </div>
              <div class="about-stat" id="views">
                <div class="about-stat-value">
                  <span class="st-channel-view-count"></span>
                </div>
                <span> views</span>
              </div>
              <div class="about-stat" id="videos">
                <div class="about-stat-value">
                  <span class="st-channel-video-count"></span>
                </div>
                <span> videos</span>
              </div>
              <div class="about-stat joined-date">
                <span class="st-joined-date"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="st-related-panel" class="watch-sidebar-section st-expandable-panel st-side-panel st-scrollable-panel new hid" expanded>
    <button class="st-side-panel-expander flex-bar">
      <span class="st-side-panel-icon">
        <div class="st-svg">
<div class="filled-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
<div class="outline-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
</div>
      </span>
      <span>Related Videos</span>
      <div class="st-related-grid-toggle-holder"></div>
    </button>
    <div class="st-side-panel-inner">
      <h4 class="watch-sidebar-head">Related</h4>
      <div class="watch-sidebar-body">
        <div id="watch-related-holder">
        </div>
      </div>
    </div>
  </div>
  <div id="st-chat-panel" class="watch-sidebar-section st-expandable-panel st-side-panel st-scrollable-panel new hid">
    <button class="st-side-panel-expander flex-bar">
      <span class="st-side-panel-icon">
        <div class="st-svg">
<div class="filled-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
<div class="outline-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
</div>
      </span>
      <span>Live Chat</span>
      <div class="st-related-grid-toggle-holder"></div>
    </button>
    <div class="st-side-panel-inner">
      <h4 class="watch-sidebar-head">Live Chat</h4>
      <div class="watch-sidebar-body">
        <div id="watch-chat-holder">
        </div>
      </div>
    </div>
  </div>
  <div id="st-comments-panel" class="watch-sidebar-section st-expandable-panel st-side-panel st-scrollable-panel new hid" expanded>
    <button class="st-side-panel-expander flex-bar">
      <span class="st-side-panel-icon">
      </span>
      <span>Comments</span>
      <div class="st-related-grid-toggle-holder"></div>
    </button>
    <div class="st-side-panel-inner">
      <div class="st-side-panel-header flex-bar flex-bar st-show-svgs">
        <div class="st-side-panel-header-text flex-bar">
          <span>Comments </span>
          <span class="st-side-panel-header-sub st-comment-count"></span>
        </div>
        <button class="st-side-panel-close">
          <div class="st-svg">
<div class="filled-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
<div class="outline-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
</div>
        </button>
      </div>
      <div class="watch-sidebar-body">
        <div id="watch-comments-holder">
        </div>
      </div>
    </div>
  </div>
  <div id="st-transcript-panel" class="watch-sidebar-section st-expandable-panel st-side-panel st-scrollable-panel new hid" expanded>
    <button class="st-side-panel-expander flex-bar">
      <span class="st-side-panel-icon">
      </span>
      <span>Transcript</span>
      <div class="st-related-grid-toggle-holder"></div>
    </button>
    <div class="st-side-panel-inner">
      <div class="st-side-panel-header flex-bar st-show-svgs">
        <div class="st-side-panel-header-text flex-bar">
          <span>Transcript </span>
        </div>
        <button class="st-side-panel-close">
          <div class="st-svg">
<div class="filled-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
<div class="outline-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
</div>
        </button>
      </div>
      <div class="watch-sidebar-body">
        <div class="st-transcript-content">
        </div>
      </div>
    </div>
  </div>
</div>`
    },
    watchBelow: `<div id="st-watch-below" class="st-watch-multistate st-multistate-handler" state="normal">
    <div id="st-ratings-info-row-holder" class="st-contents">
    </div>
    <div id="st-watch-tabs-row-holder" class="st-contents">
    </div>
    <div id="st-below-title-row-holder" class="st-contents">
    </div>
    <div id="st-desc-actions-row-holder" class="st-contents">
    </div>
    <div id="st-actions-info-row-holder" class="st-contents">
    </div>
    <div id="st-info-actions-row-holder" class="st-contents">
    </div>
    <div id="st-owner-actions-row-holder" class="st-contents">
    </div>
    <div id="st-owner-row-holder" class="st-contents">
    </div>
    <div id="st-owner-teaser-row-holder" class="st-contents">
    </div>
    <div id="st-owner-info-row-holder" class="st-contents">
    </div>
    <div id="st-actions-row-holder" class="st-contents">
    </div>
    <div id="st-desc-teaser-row-holder" class="st-contents">
    </div>
    <div id="st-floaters-row-holder" class="st-contents">
    </div>
    <div id="st-panels-row-holder" class="st-contents">
    </div>
    <div id="st-desc-row-holder" class="st-contents">
    </div>
    <div id="st-slider-row-holder" class="st-contents">
    </div>
    <div id="st-popups-row-holder" class="st-contents">
    </div>
    <div id="st-extras-row-holder" class="st-contents">
    </div>
    <div id="st-below-tabs-row-holder" class="st-contents">
    </div>
    <div id="st-below-related-row-holder" class="st-contents">
    </div>
</div>`,
    watchAbove: `<div id="st-watch-above">
    <div id="st-above-title-row-holder" class="st-contents">
    </div>
    <div id="st-above-owner-row-holder" class="st-contents">
    </div>
    <div id="st-above-videos-row-holder" class="st-contents">
    </div>
</div>`,
    watchSide: `<div id="st-watch-side">
    <div id="st-side-banner-row-holder" class="st-contents">
    </div>
    <div id="st-side-title-row-holder" class="st-contents">
    </div>
    <div id="st-side-owner-row-holder" class="st-contents">
    </div>
    <div id="st-side-poly-owner-row-holder" class="st-contents">
    </div>
    <div id="st-side-desc-row-holder" class="st-contents">
    </div>
    <div id="st-side-actions-row-holder" class="st-contents">
    </div>
    <div id="st-side-tabs-row-holder" class="st-contents">
    </div>
    <div id="st-side-panels-row-holder" class="st-contents">
    </div>
</div>`,
    horizontalRule: `<div class="horizontal-rule "><span class="first"></span><span class="second"></span><span class="third"></span></div>`,
    verticalRules: `<span class="vertical-rule-main"></span>
<span class="vertical-rule-corner-top"></span>
<span class="vertical-rule-corner-bottom"></span>`,
    loadMore: `<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default"><span class="yt-uix-button-content"><span class="run">Load more</span><span class="loading hid"><span class="yt-spinner"><img src="https://s.ytimg.com/yts/img/pixel-vfl3z5WfW.gif" title="Loading icon" class="yt-spinner-img yt-sprite">
Loading...</span></span></span></button>`,
    moreDots: `<g>
     <circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle>
</g>`,
    popups: `<div id="wmr-fence" visible="false">
</div>
<div id="wmr-share-popup" class="wmr-popup" visible="false">
    <div class="wmr-popup-inner">
    </div>
</div>
<div id="wmr-addto-popup" class="wmr-popup" visible="false">
    <div class="wmr-popup-inner">
    </div>
</div>`,
    polyPlaylistOwner: `<div id="st-pp-left" class="flex-bar">
    <div id="st-pp-pfp">
    </div>
    <div id="st-pp-name">
    </div>
</div>
<div id="st-pp-sub">
</div>`,
    polyPlaylistActions: `          <div id="st-pp-save" class="st-icon-button filled flex-bar yt-uix-tooltip" title="Save playlist">
                              <div class="st-svg">
                                  <div class="filled-icon">
                                      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g mirror-in-rtl="" class="style-scope yt-icon">
  <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z" class="style-scope yt-icon"></path>
</g></svg>
                                  </div>
                                  <div class="outline-icon">
                                      <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="M22,13h-4v4h-2v-4h-4v-2h4V7h2v4h4V13z M14,7H2v1h12V7z M2,12h8v-1H2V12z M2,16h8v-1H2V16z"></path></svg>
                                  </div>
                              </div>
                          </div>
          <div id="st-pp-shuffle" class="st-icon-button filled flex-bar yt-uix-tooltip" title="Shuffle play">
                              <div class="st-svg">
                                  <div class="filled-icon">
                                      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g mirror-in-rtl="" class="style-scope yt-icon">
  <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" class="style-scope yt-icon"></path>
</g></svg>
                                  </div>
                                  <div class="outline-icon">
                                      <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="M18.15,13.65l3.85,3.85l-3.85,3.85l-0.71-0.71L20.09,18H19c-2.84,0-5.53-1.23-7.39-3.38l0.76-0.65 C14.03,15.89,16.45,17,19,17h1.09l-2.65-2.65L18.15,13.65z M19,7h1.09l-2.65,2.65l0.71,0.71l3.85-3.85l-3.85-3.85l-0.71,0.71 L20.09,6H19c-3.58,0-6.86,1.95-8.57,5.09l-0.73,1.34C8.16,15.25,5.21,17,2,17v1c3.58,0,6.86-1.95,8.57-5.09l0.73-1.34 C12.84,8.75,15.79,7,19,7z M8.59,9.98l0.75-0.66C7.49,7.21,4.81,6,2,6v1C4.52,7,6.92,8.09,8.59,9.98z"></path></svg>
                                  </div>
                              </div>
                          </div>
          <div id="st-pp-share" class="st-icon-button filled flex-bar yt-uix-tooltip" title="Share">
                              <div class="st-svg">
                                  <div class="filled-icon">
                                      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g mirror-in-rtl="" class="style-scope yt-icon">
  <path d="M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z" class="style-scope yt-icon"></path>
</g></svg>
                                  </div>
                                  <div class="outline-icon">
                                      <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="M15,5.63L20.66,12L15,18.37V15v-1h-1c-3.96,0-7.14,1-9.75,3.09c1.84-4.07,5.11-6.4,9.89-7.1L15,9.86V9V5.63 M14,3v6 C6.22,10.13,3.11,15.33,2,21c2.78-3.97,6.44-6,12-6v6l8-9L14,3L14,3z"></path></svg>
                                  </div>
                              </div>
                          </div>
          <div id="st-pp-more" class="st-icon-button filled flex-bar">
                              <div class="st-svg">
                                  <div class="filled-icon">
                                      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g>
               <circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle>
          </g></svg>
                                  </div>
                                  <div class="outline-icon">
                                      <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="M7.5,12c0,0.83-0.67,1.5-1.5,1.5S4.5,12.83,4.5,12s0.67-1.5,1.5-1.5S7.5,11.17,7.5,12z M12,10.5c-0.83,0-1.5,0.67-1.5,1.5 s0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5S12.83,10.5,12,10.5z M18,10.5c-0.83,0-1.5,0.67-1.5,1.5s0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5 S18.83,10.5,18,10.5z"></path></svg>
                                  </div>
                              </div>
                          </div>`,
    commentRating: `<div class="comment-rating">
    <span class="count"></span>
    <span class="active-count"></span>
    <img class="comments-rating-thumbs-up" src="https://s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif">
    <span class="hearted" title="Hearted by video creator">❤</span>
</div>
<div class="load-more-link">
    <span class="expand-text">Show replies</span>
    <span class="expanded-text">Hide replies</span>
</div>`,
    commentLike: `                                <div class="filled-icon">
<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z" class="style-scope yt-icon"></path>
  </g></svg>
  </span>
  </div>
  <div class="outline-icon">
      <div class="regular-icon">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon"><path d="M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11H3v10h4h1h9.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z M7,20H4v-8h3V20z M19.98,13.17l-1.34,6 C18.54,19.65,18.03,20,17.43,20H8v-8.61l5.6-6.06C13.79,5.12,14.08,5,14.38,5c0.26,0,0.5,0.11,0.63,0.3 c0.07,0.1,0.15,0.26,0.09,0.47l-1.52,4.94L13.18,12h1.35h4.23c0.41,0,0.8,0.17,1.03,0.46C19.92,12.61,20.05,12.86,19.98,13.17z" class="style-scope yt-icon"></path></g></svg>
      </div>
      <div class="active-icon">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
      <g id="like-filled"><path d="M3,11h3v10H3V11z M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11v10h10.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z"></path></g>
      </svg>
      </div>
  </div>`,
    commentDislike: `                                <div class="filled-icon">
<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
    <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" class="style-scope yt-icon"></path>
  </g></svg>
  </div>
        <div class="outline-icon">
      <div class="regular-icon">
<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon"><path d="M17,4h-1H6.57C5.5,4,4.59,4.67,4.38,5.61l-1.34,6C2.77,12.85,3.82,14,5.23,14h4.23l-1.52,4.94C7.62,19.97,8.46,21,9.62,21 c0.58,0,1.14-0.24,1.52-0.65L17,14h4V4H17z M10.4,19.67C10.21,19.88,9.92,20,9.62,20c-0.26,0-0.5-0.11-0.63-0.3 c-0.07-0.1-0.15-0.26-0.09-0.47l1.52-4.94l0.4-1.29H9.46H5.23c-0.41,0-0.8-0.17-1.03-0.46c-0.12-0.15-0.25-0.4-0.18-0.72l1.34-6 C5.46,5.35,5.97,5,6.57,5H16v8.61L10.4,19.67z M20,13h-3V5h3V13z" class="style-scope yt-icon"></path></g></svg>
</div>
      <div class="active-icon">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
<g id="dislike-filled"><path d="M18,4h3v10h-3V4z M5.23,14h4.23l-1.52,4.94C7.62,19.97,8.46,21,9.62,21c0.58,0,1.14-0.24,1.52-0.65L17,14V4H6.57 C5.5,4,4.59,4.67,4.38,5.61l-1.34,6C2.77,12.85,3.82,14,5.23,14z"></path></g>
</svg>
      </div>
  </div>`,
    commentReplies: `                    <div class="ironfilled-icon">
<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon"><path d="M18,9l-6,6L6,9H18z" class="style-scope yt-icon"></path></g></svg>
  </div>
        <div class="wil-icon none">
<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon"><path d="M17,4h-1H6.57C5.5,4,4.59,4.67,4.38,5.61l-1.34,6C2.77,12.85,3.82,14,5.23,14h4.23l-1.52,4.94C7.62,19.97,8.46,21,9.62,21 c0.58,0,1.14-0.24,1.52-0.65L17,14h4V4H17z M10.4,19.67C10.21,19.88,9.92,20,9.62,20c-0.26,0-0.5-0.11-0.63-0.3 c-0.07-0.1-0.15-0.26-0.09-0.47l1.52-4.94l0.4-1.29H9.46H5.23c-0.41,0-0.8-0.17-1.03-0.46c-0.12-0.15-0.25-0.4-0.18-0.72l1.34-6 C5.46,5.35,5.97,5,6.57,5H16v8.61L10.4,19.67z M20,13h-3V5h3V13z" class="style-scope yt-icon"></path></g></svg>
  </div>`,
    c3Page: `            <div id="channels3" class="c3">
                <div id="c3-header">
                    <div id="c3-header-upper" class="flex-bar">
                        <div class="c3-header-left flex-bar">
                            <a id="c3-channel-pfp" class="stx-link" stx-ep="browse" stx-id="{{id}}" href="/channel/{{id}}">
                                <img>
                            </a>
                            <div id="c3-details-area">
                                <div id="c3-name-area">
                                <div id="c3-playlist-title">
                                    <span></span>
                                </div>
                                <div id="c3-channel-name">
                                    <span class="c3-by">by</span>
                                    <a class="c3-name-link stx-link" stx-ep="browse" stx-id="{{id}}" href="/channel/{{id}}"></a>
                                    <span class="c3-name"></span>
                                </div>
                                </div>
                            <div id="c3-playlist-actions">
                                 <div class="c3-playall">
            <a>
                <span class="c3-arrow"></span>
                <span>Play all</span>
            </a>
                            </div>
                            </div>
                            </div>
                            <div id="c3-subscribe" class="c3-subscribe">
                            </div>
                        </div>
                        <div id="c3-header-meta" class="c3-header-right flex-bar">
                        <div class="c3-loading">
                            <p class="yt-spinner"><img class="yt-spinner-img" src="//s.ytimg.com/yts/img/pixel-vfl3z5WfW.gif">
<span class="yt-spinner-message">Loading...</span></p>
                        </div>
                        </div>
                    </div>
                    <div id="c3-header-lower" class="flex-bar">
                        <div id="c3-tabs" class="flex-bar">
                            <a id="c3-featured-tab" class="c3-tab flex-bar stx-link" stx-ep="browse" stx-id="{{id}}" href="/channel/{{id}}/featured">
                                <span>Featured</span>
                            </a>
                            <a id="c3-feed-tab" class="c3-tab flex-bar stx-link" stx-ep="browse" stx-id="{{id}}" stx-params="EghmZWF0dXJlZPIGBAoCMgA%3D" href="/channel/{{id}}/feed">
                                <span>Feed</span>
                            </a>
                            <a id="c3-videos-tab" class="c3-tab flex-bar stx-link" stx-ep="browse" stx-id="{{id}}" stx-params="EgZ2aWRlb3PyBgQKAjoA" href="/channel/{{id}}/videos?view=0">
                                <span>Videos</span>
                            </a>
                        </div>
                        <div id="c3-search">
                        <form id="channel-search" action="/channel/{{id}}/search">
<input name="query" type="text" class="search-field label-input-label" placeholder="Search Channel">
<button class="search-btn" type="submit">
  <span class="search-btn-content">
Search
  <span>
</span></span></button>
</form>
                        </div>
                    </div>
                </div>
                <div id="c3-below" class="flex">
                    <div id="c3-content">
                        <div id="c3-nav">
                            <a id="c3-uploads-nav" class="c3-nav-item c3-videos-tab stx-link" stx-ep="browse" stx-id="{{id}}" stx-params="EgZ2aWRlb3PyBgQKAjoA" href="/channel/{{id}}/videos?view=0">
                                <span>Uploaded Videos</span>
                            </a>
                            <a id="c3-playlists-nav" class="c3-nav-item c3-videos-tab stx-link" stx-ep="browse" stx-id="{{id}}" stx-params="EglwbGF5bGlzdHPyBgQKAkIA" href="/channel/{{id}}/playlists">
                                <span>Playlists</span>
                            </a>
                            <a id="c3-activity-nav" class="c3-nav-item c3-feed-tab stx-link" stx-ep="browse" stx-id="{{id}}" stx-params="EghmZWF0dXJlZPIGBAoCMgA%3D" href="/channel/{{id}}/feed">
                                <span>Channel Activity</span>
                            </a>
                            <a id="c3-backstage-nav" class="c3-nav-item c3-feed-tab stx-link" stx-ep="browse"stx-id="{{id}}" stx-params="EgVwb3N0c_IGBAoCSgA%3D" href="/channel/{{id}}/posts">
                                <span>Backstage</span>
                            </a>
                        </div>
                        <div id="c3-feed-header-rule">
                                                <div class="horizontal-rule">
<span class="first"></span>
<span class="second"></span>
<span class="third"></span>
</div>
</div>
                        <div id="c3-content-area">
                            <div id="c3-featured-slot">
                            </div>
                            <div id="c3-content-header">
                            </div>
                            <div id="c3-content-items">
                            </div>
                        </div>
                    </div>
                    <div id="c3-sidebar">
                        <div class="c3-loading">
                            <p class="yt-spinner"><img class="yt-spinner-img" src="//s.ytimg.com/yts/img/pixel-vfl3z5WfW.gif">
<span class="yt-spinner-message">Loading...</span></p>
                        </div>
                    </div>
                </div>
            </div>`,
    c3Video: `                <div class="context-data-item yt-lockup clearfix yt-lockup-grid yt-lockup-video"><div class="yt-lockup-thumbnail"><a class="ux-thumb-wrap contains-addto " href="{{href}}">    <span class="video-thumb yt-thumb yt-thumb-185 yt-thumb-fluid"><span class="yt-thumb-default">
    <span class="yt-thumb-clip">
      <span class="yt-thumb-clip-inner">
        <img alt="Thumbnail" src="{{thumbnail}}" width="185">
        <span class="vertical-align"></span>
      </span>
    </span>
  </span></span>
<span class="video-time">{{length}}</span>
<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default addto-button video-actions addto-watch-later-button yt-uix-button-size-small yt-uix-button-empty"><span class="yt-uix-button-content"><img src="//s.ytimg.com/yts/img/pixel-vfl3z5WfW.gif"></span></button>
</a></div><div class="yt-lockup-content"><h3 class="yt-lockup-title">
<a class="yt-uix-sessionlink yt-uix-tile-link yt-ui-ellipsis yt-ui-ellipsis-2 g-hovercard" dir="ltr" href="{{href}}"><span class="yt-ui-ellipsis-wrapper">{{title}}</span></a>
</h3>
<div class="yt-lockup-meta yt-ui-ellipsis yt-ui-ellipsis-2"><ul class="yt-lockup-meta-info">
<li class="view-count-stat">{{viewCount}}</li>
<li class="yt-lockup-deemphasized-text">{{publishDate}}</li></ul></div>
</div></div>`,
    c3LoadMore: `<span class="continuation_item_wrapper"><button class="yt-uix-button yt-uix-button-size-large yt-uix-button-size-wide yt-uix-button-default load-more-button yt-uix-load-more"><span class="yt-uix-button-content"><span class="run">Show more</span><span class="loading hid"><span class="yt-spinner"><img src="https://s.ytimg.com/yts/img/pixel-vfl3z5WfW.gif" title="Loading icon" class="yt-spinner-img yt-sprite">
Loading...</span></span></span></button></span>`,
    c3BackstageNote: `<div class="yt-alert yt-alert-default yt-alert-warn">  <div class="yt-alert-icon">
<img src="//s.ytimg.com/yts/img/pixel-vfl3z5WfW.gif" class="icon master-sprite" alt="Alert icon">
</div>
<div class="yt-alert-buttons"><button class="yt-uix-button yt-uix-button-size-default yt-uix-button-empty close" style="NONE"><span class="yt-uix-button-content"></span></button></div><div class="yt-alert-content" role="alert">    <span class="yt-alert-vertical-trick"></span>
<div class="yt-alert-message"><span class="run run-text">You won't be able to interact with this page on this layout. </span><a id="c3-redir" class="run run-link" href="">Click here to view this page in the new channels layout.</a><span class="run run-text"></span></div>
</div></div>`,
    c3FeaturedList: `<div class="c3-featured-list-items">
</div>`,
    c3FeaturedChannels: `            <div class="c3-sidebar-header">
    <span>{{title}}</span>
</div>
<div class="c3-sidebar-content">
    <div class="c3-border yt-horizontal-rule"></div>
</div>`,
    c3FeaturedPlaylists: `            <div class="c3-sidebar-header">
    <span>{{title}}</span>
</div>
<div class="c3-sidebar-content">
    <div class="c3-border yt-horizontal-rule"></div>
</div>`,
    c3HeaderMeta: `<div id="c3-sub-count" class="c3-meta-item c3-channel-item">
    <span class="c3-meta-value">{{shortSubCount}}</span>
    <span class="c3-meta-name">subscribers</span>
</div>
<div id="c3-view-count" class="c3-meta-item c3-channel-item">
    <span class="c3-meta-value">{{shortViewCount}}</span>
    <span class="c3-meta-name">video views</span>
</div>
<div id="c3-pl-video-count" class="c3-meta-item c3-playlist-item">
    <span class="c3-meta-value"></span>
    <span class="c3-meta-name">videos</span>
</div>
<div id="c3-pl-view-count" class="c3-meta-item c3-playlist-item">
    <span class="c3-meta-value"></span>
    <span class="c3-meta-name">views</span>
</div>`,
    c3Sidebar: `<div class="c3-sidebar-top">
</div>
<div class="c3-sidebar-section">
    <div class="c3-sidebar-header">
        <span>About {{name}}</span>
    </div>
    <div class="c3-sidebar-content">
        <div class="c3-sidebar-item" id="c3-description">
            <span>{{description}}</span>
        </div>
        <div class="c3-sidebar-item hid" id="c3-channel-links-slot">
        </div>
        <div class="c3-border yt-horizontal-rule"></div>
        <div class="c3-sidebar-item" id="c3-joined-date">
            <h5>Date Joined</h5>
            <span>{{shortJoinedDate}}</span>
        </div>
        <div class="c3-sidebar-item hid" id="c3-location">
            <h5>Location</h5>
            <span>{{country}}</span>
        </div>
        <div class="c3-sidebar-item" id="c3-video-count">
            <h5>Uploads</h5>
            <span>{{videoCount}}</span>
        </div>
        <div class="c3-border yt-horizontal-rule"></div>
    </div>
</div>
<div class="c3-sidebar-section c3-subscribe" id="c3-sidebar-subscribe">
</div>
<div class="c3-sidebar-section" id="c3-featured-playlists-slot">
</div>
<div class="c3-sidebar-section" id="c3-featured-channels-slot">
</div>`,
    c3Link: `<a class="c3-channel-link flex-bar">
    <div class="c3-channel-link-icon flex">
        <img></img>
    </div>
    <div class="c3-channel-link-text">
        <span></span>
    </div>
</a>`,
    c3VideosHeader: `            <div class="c3-content-header-inner flex-bar">
            <div class="c3-content-header-left">
                    <span>Uploaded Videos</span>
                    <span class="c3-grey-text">({{shortVideoCount}})</span>
                    </div>
                    <div class="c3-content-header-right">
                    <div id="c3-filter-dropdown"  state="newest">
                        <button type="button" class="video-sort-btn yt-uix-button yt-uix-button-default yt-uix-button-size-default" onclick=";return false;" role="button" aria-pressed="false" aria-expanded="false" aria-haspopup="true" aria-activedescendant="">
                        <span class="yt-uix-button-content c3-popular">Most popular </span>
                        <span class="yt-uix-button-content c3-newest">Date added (newest - oldest) </span>
                        <span class="yt-uix-button-content c3-oldest">Date added (oldest - newest) </span>
                        <img class="yt-uix-button-arrow" src="https://s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif" alt="">
                        <ul class="yt-uix-button-menu hid" state="newest" id="c3-filter-menu" role="menu" aria-haspopup="true" style="min-width: 185px; left: 1195px; top: 439px; display: none;">
                        <li role="menuitem" id="c3-sort-popular">
                        <span class=" yt-uix-button-menu-item">Most popular</span>
                        </li>
                        <li role="menuitem" id="c3-sort-newest">
                        <span class=" yt-uix-button-menu-item">Date added (newest - oldest)</span>
                        </li>
                        <li role="menuitem" id="c3-sort-oldest">
                        <span class=" yt-uix-button-menu-item">Date added (oldest - newest)</span>
                        </li>
                        </ul>
                        </button>
                    </div>
                    </div>
                    </div>
                    <div class="horizontal-rule">
<span class="first"></span>
<span class="second"></span>
<span class="third"></span>
</div>`,
    c3Loading: `<div class="c3-loading">
                            <p class="yt-spinner"><img class="yt-spinner-img" src="//s.ytimg.com/yts/img/pixel-vfl3z5WfW.gif">
<span class="yt-spinner-message">Loading...</span></p>
                        </div>`,
    c3PlaylistsHeader: `            <div class="c3-content-header-inner flex-bar">
            <div class="c3-content-header-left">
                    <span>Playlists</span>
                    <span class="c3-grey-text"></span>
                    </div>
                    <div class="c3-content-header-right">
                    </div>
                    </div>
                    <div class="horizontal-rule">
<span class="first"></span>
<span class="second"></span>
<span class="third"></span>
</div>`,
    items: {
        superCompactVideo: `<div class="sc-video-inner">
    <div class="sc-video-thumbnail">
        <img src="{{thumbnail}}"></img>
        <div class="sc-video-time">
            <span>{{time}}</span>
        </div>
    </div>
    <div class="sc-video-metadata">
        <div class="sc-video-title">
            <span>{{title}}</span>
        </div>
        <div class="sc-video-info">
            <div class="sc-video-view-count">
                <span>{{viewCount}}</span>
            </div>
            <div class="sc-video-date">
                <span>{{date}}</span>
            </div>
        </div>
    </div>
</div>`,
        videosTabVideo: `            <a href="{{href}}" class="related-video yt-uix-contextlink yt-uix-sessionlink"><span class="ux-thumb-wrap contains-addto " href="{{href}}"><div class="np-overlay flex-bar"><span>Now playing</span></div>    <span class="video-thumb yt-thumb yt-thumb-120"><span class="yt-thumb-default">
    <span class="yt-thumb-clip">
      <span class="yt-thumb-clip-inner">
        <img alt="Thumbnail" src="{{thumbnail}}" width="120">
        <span class="vertical-align"></span>
      </span>
    </span>
  </span></span>
<span class="video-time">{{time}}</span>
<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default addto-button video-actions addto-watch-later-button yt-uix-button-size-small yt-uix-button-empty"><span class="yt-uix-button-content"><img src="//s.ytimg.com/yts/img/pixel-vfl3z5WfW.gif"></span></button>
</span><span dir="ltr" class="title" title="{{title}}">{{title}}</span>
</span><span class="stat view-count">{{viewCount}}<span class="extra">{{date}}</span></span></a>`,
        videosPanelVideo: `            <a href="{{href}}" class="related-video yt-uix-contextlink yt-uix-sessionlink"><span class="ux-thumb-wrap contains-addto " href="{{href}}">    <span class="video-thumb yt-thumb yt-thumb-120"><span class="yt-thumb-default">
    <span class="yt-thumb-clip">
      <span class="yt-thumb-clip-inner">
        <img alt="Thumbnail" src="{{thumbnail}}" width="120">
        <span class="vertical-align"></span>
      </span>
    </span>
  </span></span>
<span class="video-time">{{time}}</span>
<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default addto-button video-actions addto-watch-later-button yt-uix-button-size-small yt-uix-button-empty"><span class="yt-uix-button-content"><img src="//s.ytimg.com/yts/img/pixel-vfl3z5WfW.gif"></span></button>
</span><span dir="ltr" class="title" title="{{title}}">{{title}}</span>
</span><span class="stat view-count">{{viewCount}}<span class="extra">{{date}}</span></span></a>`,
        channelGridVideo: `                <div class="context-data-item yt-lockup clearfix yt-lockup-grid yt-lockup-video"><div class="yt-lockup-thumbnail"><a class="ux-thumb-wrap contains-addto " href="{{href}}">    <span class="video-thumb yt-thumb yt-thumb-185 yt-thumb-fluid"><span class="yt-thumb-default">
    <span class="yt-thumb-clip">
      <span class="yt-thumb-clip-inner">
        <img alt="Thumbnail" src="{{thumbnail}}" width="185">
        <span class="vertical-align"></span>
      </span>
    </span>
  </span></span>
<span class="video-time">{{length}}</span>
<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default addto-button video-actions addto-watch-later-button yt-uix-button-size-small yt-uix-button-empty"><span class="yt-uix-button-content"><img src="//s.ytimg.com/yts/img/pixel-vfl3z5WfW.gif"></span></button>
</a></div><div class="yt-lockup-content"><h3 class="yt-lockup-title">
<a class="yt-uix-sessionlink yt-uix-tile-link yt-ui-ellipsis yt-ui-ellipsis-2 g-hovercard" dir="ltr" href="{{href}}"><span class="yt-ui-ellipsis-wrapper">{{title}}</span></a>
</h3>
<div class="yt-lockup-meta yt-ui-ellipsis yt-ui-ellipsis-2"><ul class="yt-lockup-meta-info">
<li class="view-count-stat">{{viewCount}}</li>
<li class="yt-lockup-deemphasized-text">{{publishDate}}</li></ul></div>
</div></div>`,
        featuredPlaylist: `<a class="c3-playlist-thumbnails flex-bar" href="{{href2}}">
<div class="c3-playlist-thumbnail c3-sidethumb c3-first-thumb">
    <img src="{{thumb1}}"></img>
</div>
<div class="c3-playlist-thumbnail c3-sidethumb">
    <img></img>
</div>
<div class="c3-playlist-thumbnail c3-sidethumb">
    <img></img>
</div>
<div class="c3-playlist-thumbnail c3-sidethumb">
    <img></img>
</div>
<div class="c3-playlist-thumbnail c3-sidethumb c3-last-thumb">
    <img></img>
</div>
<div class="c3-playlist-hover-overlay flex-bar">
    <div class="c3-playlist-hover-overlay-inner flex-bar">
        <div class="c3-overlay-icon">
        </div>
        <div class="c3-overlay-text flex-bar">
            <div class="c3-playlist-play-all-text">
                <span>Play all</span>
            </div>
            <span>({{vidCount}})</span>
        </div>
    </div>
</div>
<div class="c3-playlist-overlay flex-bar">
    <div class="c3-overlay-icon">
    </div>
    <div class="c3-overlay-text">
        <div class="c3-playlist-video-count">
            <span>{{vidCount}}</span>
        </div>
        <span class="c3-videos-string">videos</span>
    </div>
</div>
</a>
<div class="c3-playlist-meta">
<a class="c3-playlist-title" href="{{href}}">{{title}}</a>
<a class="c3-playlist-byline" href="{{href3}}">{{byline}}</a>
</div>`,
        featuredChannel: `<a href="/channel/{{channelId}}" class="channel-tile tile tile-link-block stx-link" stx-ep="browse" stx-id="{{channelId}}">
<span class="thumb-container">
  <span class="video-thumb ux-thumb ux-thumb-profile-46"><span class="clip"><span class="profile-centering-wrap"><img src="{{thumbnail}}" data-group-key="thumb-group-2"></span></span></span>
</span>
<span class="channel-info">
  <span class="channel-name title">{{title}}</span>
    <span class="subscriber-count">
<strong>{{subCount}}</strong>
</span>
</span>
</a>`,
        bigListVideo: `       <li class="blogger-video">
      <span class="video tile">
<a href="/watch?v={{id}}" class="tile-link-block stx-link" stx-ep="watch" stx-id="{{id}}">
  <span class="video-thumb ux-thumb ux-thumb-288 "><span class="clip"><img src="{{thumbnail}}" alt="Thumbnail
"></span><span class="video-time">{{time}}</span></span>
  <span class="video-item-content">
      <span class="video-overview">
<span class="title video-title">{{title}}</span>
</span>
<span class="video-details">
<span class="video-owner">{{name}}</span>
  <span class="video-view-count">
{{viewCount}}
  </span>
  <span class="video-date">
{{date}}
  </span>
  <span class="video-item-description"></span>
</span>
  </span>
</a>
</span>
  </li>`,
        featuredHeader: `                <div class="c3-featured-header-inner flex-bar">
<div class="c3-featured-title">
    <span>Uploaded videos</span>
</div>
<div class="c3-featured-stats">
    <span>1-{{length}} of {{shortVideoCount}}</span>
</div>
<div class="c3-featured-playall c3-playall">
    <a href="/watch?v={{id}}&list=UU{{shortId}}" class="stx-link" stx-ep="watch" stx-id="{{id}}" stx-params="UU{{shortId}}">
        <span class="c3-arrow"></span>
        <span>Play all</span>
    </a>
</div>
</div>
<div class="horizontal-rule"></div>`
    },
    sortIcon: `  <div class="filled-icon">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g mirror-in-rtl="" class="style-scope yt-icon">
      <g id="sort">
  <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"></path>
  <path d="M0 0h24v24H0z" fill="none"></path>
</g>
      </svg>
  </div>
  <div class="outline-icon">
     <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g mirror-in-rtl="" class="style-scope yt-icon"><path d="M21 6H3V5h18v1zm-6 5H3v1h12v-1zm-6 6H3v1h6v-1z" class="style-scope yt-icon"></path></g></svg>
  </div>`,
    commentHeader: `<span class="comment-text-before">Comments</span>
<span class="comment-text-dot"> • </span>
<span class="comment-count"></span>
<span class="comment-text-after">Comments</span>`,
    pandaRules: `<span class="vertical-rule-main"></span>
<span class="vertical-rule-corner-top"></span>
<span class="vertical-rule-corner-bottom"></span>`,
    shelfRule: `<span class="first"></span>
<span class="second"></span>
<span class="third"></span>`,
    guideIcons: {
        home: `                    <div class="filled-icon">
                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8" class="style-scope yt-icon"></path>
  </g></svg>
  </div>
                    <div class="outline-icon">
      <div class="regular-icon">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
<g class="style-scope yt-icon"><path d="M12,4.33l7,6.12V20H15V14H9v6H5V10.45l7-6.12M12,3,4,10V21h6V15h4v6h6V10L12,3Z" class="style-scope yt-icon"></path></g>
</svg>
      </div>
      <div class="active-icon">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
<g><path d="M4 21V10.08l8-6.96 8 6.96V21h-6v-6h-4v6H4z"></path></g>
</svg>
      </div>
  </div>`,
        subscriptions: `                    <div class="filled-icon">
<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
    <path d="M18.7 8.7H5.3V7h13.4v1.7zm-1.7-5H7v1.6h10V3.7zm3.3 8.3v6.7c0 1-.7 1.6-1.6 1.6H5.3c-1 0-1.6-.7-1.6-1.6V12c0-1 .7-1.7 1.6-1.7h13.4c1 0 1.6.8 1.6 1.7zm-5 3.3l-5-2.7V18l5-2.7z" class="style-scope yt-icon"></path>
  </g></svg>
  </div>
                    <div class="outline-icon">
      <div class="regular-icon">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
<g id="subscriptions"><path d="M10,18v-6l5,3L10,18z M17,3H7v1h10V3z M20,6H4v1h16V6z M22,9H2v12h20V9z M3,10h18v10H3V10z"></path></g>
</svg>
      </div>
      <div class="active-icon">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
<g id="subscriptions-filled"><path d="M20,7H4V6h16V7z M22,9v12H2V9H22z M15,15l-5-3v6L15,15z M17,3H7v1h10V3z"></path></g>
</svg>
      </div>
  </div>`,
        history: `                    <div class="filled-icon">
<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
    <path d="M11.9 3.75c-4.55 0-8.23 3.7-8.23 8.25H.92l3.57 3.57.04.13 3.7-3.7H5.5c0-3.54 2.87-6.42 6.42-6.42 3.54 0 6.4 2.88 6.4 6.42s-2.86 6.42-6.4 6.42c-1.78 0-3.38-.73-4.54-1.9l-1.3 1.3c1.5 1.5 3.55 2.43 5.83 2.43 4.58 0 8.28-3.7 8.28-8.25 0-4.56-3.7-8.25-8.26-8.25zM11 8.33v4.6l3.92 2.3.66-1.1-3.2-1.9v-3.9H11z" class="style-scope yt-icon"></path>
  </g></svg>
  </div>
                    <div class="outline-icon">
      <div class="regular-icon">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
<g id="watch_history"><path d="M14.97,16.95L10,13.87V7h2v5.76l4.03,2.49L14.97,16.95z M22,12c0,5.51-4.49,10-10,10S2,17.51,2,12h1c0,4.96,4.04,9,9,9 s9-4.04,9-9s-4.04-9-9-9C8.81,3,5.92,4.64,4.28,7.38C4.17,7.56,4.06,7.75,3.97,7.94C3.96,7.96,3.95,7.98,3.94,8H8v1H1.96V3h1v4.74 C3,7.65,3.03,7.57,3.07,7.49C3.18,7.27,3.3,7.07,3.42,6.86C5.22,3.86,8.51,2,12,2C17.51,2,22,6.49,22,12z"></path></g>
</svg>
      </div>
      <div class="active-icon">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
<g id="watch_history-filled"><path d="M14.97,16.95L10,13.87V7h2v5.76l4.03,2.49L14.97,16.95z M12,2C8.73,2,5.8,3.44,4,5.83V3.02H2V9h6V7H5.62 C7.08,5.09,9.36,4,12,4c4.41,0,8,3.59,8,8s-3.59,8-8,8s-8-3.59-8-8H2c0,5.51,4.49,10,10,10s10-4.49,10-10S17.51,2,12,2z"></path></g>
</svg>
      </div>
  </div>`,
        trending: `                    <div class="filled-icon">
<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
    <path d="M17.53 11.2c-.23-.3-.5-.56-.76-.82-.65-.6-1.4-1.03-2.03-1.66-1.46-1.46-1.78-3.87-.85-5.72-.9.23-1.75.75-2.45 1.32C8.9 6.4 7.9 10.07 9.1 13.22c.04.1.08.2.08.33 0 .22-.15.42-.35.5-.22.1-.46.04-.64-.12-.06-.05-.1-.1-.15-.17-1.1-1.43-1.28-3.48-.53-5.12C5.87 10 5 12.3 5.12 14.47c.04.5.1 1 .27 1.5.14.6.4 1.2.72 1.73 1.04 1.73 2.87 2.97 4.84 3.22 2.1.27 4.35-.12 5.96-1.6 1.8-1.66 2.45-4.3 1.5-6.6l-.13-.26c-.2-.45-.47-.87-.78-1.25zm-3.1 6.3c-.28.24-.73.5-1.08.6-1.1.38-2.2-.16-2.88-.82 1.2-.28 1.9-1.16 2.1-2.05.17-.8-.14-1.46-.27-2.23-.12-.74-.1-1.37.2-2.06.15.38.35.76.58 1.06.76 1 1.95 1.44 2.2 2.8.04.14.06.28.06.43.03.82-.32 1.72-.92 2.26z" class="style-scope yt-icon"></path>
  </g></svg>
  </div>
                    <div class="outline-icon">
      <div class="regular-icon">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
<g id="trending"><path d="M14.72,17.84c-0.32,0.27-0.83,0.53-1.23,0.66c-1.34,0.33-2.41-0.34-2.62-0.46c-0.21-0.11-0.78-0.38-0.78-0.38 s0.35-0.11,0.41-0.13c1.34-0.54,1.89-1.24,2.09-2.11c0.2-0.84-0.16-1.56-0.31-2.39c-0.12-0.69-0.11-1.28,0.12-1.9 c0.02-0.05,0.12-0.43,0.12-0.43s0.11,0.35,0.13,0.41c0.71,1.51,2.72,2.18,3.07,3.84c0.03,0.15,0.05,0.3,0.05,0.46 C15.8,16.3,15.4,17.26,14.72,17.84z M12.4,4.34c-0.12,0.08-0.22,0.15-0.31,0.22c-2.99,2.31-2.91,5.93-2.31,8.55l0.01,0.03l0.01,0.03 c0.06,0.35-0.05,0.7-0.28,0.96c-0.24,0.26-0.58,0.41-0.95,0.41c-0.44,0-0.85-0.2-1.22-0.6c-0.67-0.73-1.17-1.57-1.5-2.46 c-0.36,0.77-0.75,1.98-0.67,3.19c0.04,0.51,0.12,1,0.25,1.43c0.18,0.6,0.43,1.16,0.75,1.65c1.05,1.66,2.88,2.82,4.78,3.05 c0.42,0.05,0.85,0.08,1.26,0.08c1.34,0,3.25-0.27,4.74-1.57c1.77-1.56,2.35-3.99,1.44-6.06c-0.04-0.1-0.06-0.14-0.09-0.19 l-0.04-0.08c-0.21-0.42-0.47-0.81-0.75-1.14c-0.24-0.3-0.48-0.56-0.79-0.83c-0.3-0.27-0.64-0.51-1-0.77 c-0.46-0.33-0.93-0.67-1.38-1.09C12.98,7.83,12.3,6.11,12.4,4.34 M14.41,2c0,0-0.2,0.2-0.56,0.99c-0.66,1.92-0.15,3.95,1.34,5.39 c0.73,0.69,1.61,1.17,2.36,1.84c0.32,0.29,0.62,0.59,0.89,0.93c0.36,0.42,0.66,0.89,0.91,1.38c0.05,0.1,0.1,0.2,0.14,0.3 c1.12,2.55,0.36,5.47-1.73,7.31C16.23,21.47,14.22,22,12.22,22c-0.47,0-0.95-0.03-1.41-0.09c-2.29-0.28-4.42-1.66-5.63-3.57 c-0.39-0.6-0.68-1.26-0.88-1.93c-0.16-0.54-0.25-1.1-0.29-1.67c-0.12-1.88,0.67-3.63,1.08-4.31c0.41-0.69,1.55-2.18,1.55-2.18 s0,0.03-0.01,0.09C6.41,10.11,7,11.88,8.22,13.22c0.15,0.17,0.27,0.22,0.34,0.22c0.06,0,0.09-0.04,0.08-0.09 C7.79,9.59,8.37,6,11.35,3.7c0.59-0.46,1.51-0.94,1.98-1.18C13.8,2.28,14.41,2,14.41,2L14.41,2z"></path></g>
</svg>
      </div>
      <div class="active-icon">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
<g id="trending-filled"><path d="M19.48,12.83c-0.04-0.1-0.09-0.2-0.14-0.3c-0.25-0.49-0.55-0.96-0.91-1.38c-0.27-0.34-0.57-0.65-0.89-0.93 c-0.75-0.67-1.63-1.14-2.36-1.84c-1.49-1.44-2-3.46-1.34-5.39C14.2,2.2,14.41,2,14.41,2s-0.6,0.28-1.07,0.52 c-0.47,0.24-1.39,0.72-1.98,1.18C8.37,6,7.79,9.59,8.64,13.35c0.01,0.05-0.02,0.09-0.08,0.09c-0.07,0-0.18-0.06-0.34-0.22 C7,11.88,6.41,10.11,6.64,8.35c0.01-0.06,0.01-0.09,0.01-0.09S5.51,9.74,5.1,10.43c-0.41,0.69-1.2,2.43-1.08,4.31 c0.04,0.56,0.13,1.12,0.29,1.67c0.2,0.68,0.49,1.33,0.88,1.93c1.21,1.91,3.34,3.29,5.63,3.57c0.47,0.06,0.94,0.09,1.41,0.09 c2,0,4.01-0.53,5.53-1.87C19.84,18.3,20.6,15.38,19.48,12.83z M14.72,17.84c-0.32,0.27-0.83,0.53-1.23,0.66 c-1.34,0.33-2.41-0.34-2.62-0.46c-0.21-0.11-0.78-0.38-0.78-0.38s0.35-0.11,0.41-0.13c1.34-0.54,1.89-1.24,2.09-2.11 c0.2-0.84-0.16-1.56-0.31-2.39c-0.12-0.69-0.11-1.28,0.12-1.9c0.02-0.05,0.12-0.43,0.12-0.43s0.11,0.35,0.13,0.41 c0.71,1.51,2.72,2.18,3.07,3.84c0.03,0.15,0.05,0.3,0.05,0.46C15.8,16.3,15.4,17.26,14.72,17.84z"></path></g>
</svg>
      </div>
  </div>`,
        social: `                    <div class="filled-icon">
<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
    <path d="M16.5 12c1.38 0 2.49-1.12 2.49-2.5S17.88 7 16.5 7C15.12 7 14 8.12 14 9.5s1.12 2.5 2.5 2.5zM9 11c1.66 0 2.99-1.34 2.99-3S10.66 5 9 5C7.34 5 6 6.34 6 8s1.34 3 3 3zm7.5 3c-1.83 0-5.5.92-5.5 2.75V19h11v-2.25c0-1.83-3.67-2.75-5.5-2.75zM9 13c-2.33 0-7 1.17-7 3.5V19h7v-2.25c0-.85.33-2.34 2.37-3.47C10.5 13.1 9.66 13 9 13z" class="style-scope yt-icon"></path>
  </g></svg>
  </div>
              <div class="outline-icon">
      <div class="regular-icon">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
<g id="people"><path d="M14 20C14 17.79 15.79 16 18 16C20.21 16 22 17.79 22 20H14ZM18 16C16.9 16 16 15.1 16 14C16 12.9 16.9 12 18 12C19.1 12 20 12.9 20 14C20 15.1 19.1 16 18 16ZM15 8C15 5.79 13.21 4 11 4C8.79 4 7 5.79 7 8C7 9.96 8.42 11.59 10.28 11.93C4.77 12.21 2 15.76 2 20H12.02L12 19H3.06C3.44 15.89 5.67 12.9 11 12.9C11.62 12.9 12.19 12.95 12.73 13.03L13.57 12.19C12.99 12.06 12.38 11.96 11.72 11.93C13.58 11.59 15 9.96 15 8ZM11 11C9.35 11 8 9.65 8 8C8 6.35 9.35 5 11 5C12.65 5 14 6.35 14 8C14 9.65 12.65 11 11 11Z"></path></g>
</svg>
      </div>
      <div class="active-icon">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
<g id="people-filled"><path d="M14 20C14 17.79 15.79 16 18 16C20.21 16 22 17.79 22 20H14ZM18 16C16.9 16 16 15.1 16 14C16 12.9 16.9 12 18 12C19.1 12 20 12.9 20 14C20 15.1 19.1 16 18 16ZM12.81 20H2C2 15.76 4.77 12.21 10.28 11.93C8.42 11.59 7 9.96 7 8C7 5.79 8.79 4 11 4C13.21 4 15 5.79 15 8C15 9.96 13.58 11.59 11.72 11.93C12.64 11.98 13.47 12.12 14.23 12.34C12.87 13.44 12 15.12 12 17C12 18.09 12.3 19.12 12.81 20Z"></path></g>
</svg>
      </div>
  </div>`,
        watchLater: `                    <div class="filled-icon">
<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
    <path d="M12 3.67c-4.58 0-8.33 3.75-8.33 8.33s3.75 8.33 8.33 8.33 8.33-3.75 8.33-8.33S16.58 3.67 12 3.67zm3.5 11.83l-4.33-2.67v-5h1.25v4.34l3.75 2.25-.67 1.08z" class="style-scope yt-icon"></path>
  </g></svg>
  </div>
        <div class="outline-icon">
      <div class="regular-icon">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
<g id="watch_later"><path d="M14.97,16.95L10,13.87V7h2v5.76l4.03,2.49L14.97,16.95z M12,3c-4.96,0-9,4.04-9,9s4.04,9,9,9s9-4.04,9-9S16.96,3,12,3 M12,2c5.52,0,10,4.48,10,10s-4.48,10-10,10S2,17.52,2,12S6.48,2,12,2L12,2z"></path></g>
</svg>
      </div>
      <div class="active-icon">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
<g id="watch_later-filled"><path d="M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10s10-4.48,10-10C22,6.48,17.52,2,12,2z M14.97,16.95L10,13.87V7h2v5.76 l4.03,2.49L14.97,16.95z"></path></g>
</svg>
      </div>
  </div>`,
        liked: `                    <div class="filled-icon">
<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
    <path d="M3.75 18.75h3v-9h-3v9zm16.5-8.25c0-.83-.68-1.5-1.5-1.5h-4.73l.7-3.43.03-.24c0-.3-.13-.6-.33-.8l-.8-.78L8.7 8.7c-.3.26-.45.64-.45 1.05v7.5c0 .82.67 1.5 1.5 1.5h6.75c.62 0 1.15-.38 1.38-.9l2.27-5.3c.06-.18.1-.36.1-.55v-1.5z" class="style-scope yt-icon"></path>
  </g></svg>
  </div>
  <div class="outline-icon">
      <div class="regular-icon">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
<g id="like"><path d="M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11H3v10h4h1h9.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z M7,20H4v-8h3V20z M19.98,13.17l-1.34,6 C18.54,19.65,18.03,20,17.43,20H8v-8.61l5.6-6.06C13.79,5.12,14.08,5,14.38,5c0.26,0,0.5,0.11,0.63,0.3 c0.07,0.1,0.15,0.26,0.09,0.47l-1.52,4.94L13.18,12h1.35h4.23c0.41,0,0.8,0.17,1.03,0.46C19.92,12.61,20.05,12.86,19.98,13.17z"></path></g>
</svg>
      </div>
      <div class="active-icon">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
<g id="like-filled"><path d="M3,11h3v10H3V11z M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11v10h10.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z"></path></g>
</svg>
      </div>
  </div>`,
        guideBuilder: `<div class="filled-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path>
        </g>
    </svg>
</div>
<div class="outline-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g><path d="M17,13h-4v4h-2v-4H7v-2h4V7h2v4h4V13z M12,3c-4.96,0-9,4.04-9,9s4.04,9,9,9c4.96,0,9-4.04,9-9S16.96,3,12,3 M12,2 c5.52,0,10,4.48,10,10s-4.48,10-10,10C6.48,22,2,17.52,2,12S6.48,2,12,2L12,2z"></path></g>
    </svg>
</div>`,
        channels: `<div class="filled-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g id="settings_material">
            <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.1-1.65c.2-.15.25-.42.13-.64l-2-3.46c-.12-.22-.4-.3-.6-.22l-2.5 1c-.52-.4-1.08-.73-1.7-.98l-.37-2.65c-.06-.24-.27-.42-.5-.42h-4c-.27 0-.48.18-.5.42l-.4 2.65c-.6.25-1.17.6-1.7.98l-2.48-1c-.23-.1-.5 0-.6.22l-2 3.46c-.14.22-.08.5.1.64l2.12 1.65c-.04.32-.07.65-.07.98s.02.66.06.98l-2.1 1.65c-.2.15-.25.42-.13.64l2 3.46c.12.22.4.3.6.22l2.5-1c.52.4 1.08.73 1.7.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.6-.25 1.17-.6 1.7-.98l2.48 1c.23.1.5 0 .6-.22l2-3.46c.13-.22.08-.5-.1-.64l-2.12-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path>
        </g>
    </svg>
</div>
<div class="outline-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g id="settings"><path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,8c-2.21,0-4,1.79-4,4s1.79,4,4,4s4-1.79,4-4 S14.21,8,12,8L12,8z M13.22,3l0.55,2.2l0.13,0.51l0.5,0.18c0.61,0.23,1.19,0.56,1.72,0.98l0.4,0.32l0.5-0.14l2.17-0.62l1.22,2.11 l-1.63,1.59l-0.37,0.36l0.08,0.51c0.05,0.32,0.08,0.64,0.08,0.98s-0.03,0.66-0.08,0.98l-0.08,0.51l0.37,0.36l1.63,1.59l-1.22,2.11 l-2.17-0.62l-0.5-0.14l-0.4,0.32c-0.53,0.43-1.11,0.76-1.72,0.98l-0.5,0.18l-0.13,0.51L13.22,21h-2.44l-0.55-2.2l-0.13-0.51 l-0.5-0.18C9,17.88,8.42,17.55,7.88,17.12l-0.4-0.32l-0.5,0.14l-2.17,0.62L3.6,15.44l1.63-1.59l0.37-0.36l-0.08-0.51 C5.47,12.66,5.44,12.33,5.44,12s0.03-0.66,0.08-0.98l0.08-0.51l-0.37-0.36L3.6,8.56l1.22-2.11l2.17,0.62l0.5,0.14l0.4-0.32 C8.42,6.45,9,6.12,9.61,5.9l0.5-0.18l0.13-0.51L10.78,3H13.22 M14,2h-4L9.26,4.96c-0.73,0.27-1.4,0.66-2,1.14L4.34,5.27l-2,3.46 l2.19,2.13C4.47,11.23,4.44,11.61,4.44,12s0.03,0.77,0.09,1.14l-2.19,2.13l2,3.46l2.92-0.83c0.6,0.48,1.27,0.87,2,1.14L10,22h4 l0.74-2.96c0.73-0.27,1.4-0.66,2-1.14l2.92,0.83l2-3.46l-2.19-2.13c0.06-0.37,0.09-0.75,0.09-1.14s-0.03-0.77-0.09-1.14l2.19-2.13 l-2-3.46L16.74,6.1c-0.6-0.48-1.27-0.87-2-1.14L14,2L14,2z"></path></g>
    </svg>
</div>`,
        myChannel: `                          <div class="skybird-icon">
<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g id="account_circle">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path>
  </g></svg>
  </div>
                    <div class="filled-icon">
<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
    <path d="M3 5v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z" class="style-scope yt-icon"></path>
  </g></svg>
  </div>
  <div class="outline-icon">
      <div class="regular-icon">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
      <g id="account_box"><path d="M3,3v18h18V3H3z M4.99,20c0.39-2.62,2.38-5.1,7.01-5.1s6.62,2.48,7.01,5.1H4.99z M9,10c0-1.65,1.35-3,3-3s3,1.35,3,3 c0,1.65-1.35,3-3,3S9,11.65,9,10z M12.72,13.93C14.58,13.59,16,11.96,16,10c0-2.21-1.79-4-4-4c-2.21,0-4,1.79-4,4 c0,1.96,1.42,3.59,3.28,3.93c-4.42,0.25-6.84,2.8-7.28,6V4h16v15.93C19.56,16.73,17.14,14.18,12.72,13.93z"></path></g>
      </svg>
      </div>
      <div class="active-icon">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
      <g id="account_box-filled"><path d="M3,3v18h18V3H3z M20,20H4v-0.08c0.44-3.2,2.87-5.74,7.28-5.99C9.42,13.59,8,11.96,8,10c0-2.21,1.79-4,4-4 c2.21,0,4,1.79,4,4c0,1.96-1.42,3.59-3.28,3.93c4.41,0.25,6.84,2.8,7.28,5.99V20z"></path></g>
      </svg>
      </div>
  </div>`,
        playlist: `                    <div class="filled-icon">
<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
    <path d="M3.67 8.67h14V11h-14V8.67zm0-4.67h14v2.33h-14V4zm0 9.33H13v2.34H3.67v-2.34zm11.66 0v7l5.84-3.5-5.84-3.5z"></path>
  </g></svg>
  </div>
  <div class="outline-icon">
      <div class="regular-icon">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
<g id="like"><path d="M22,7H2v1h20V7z M13,12H2v-1h11V12z M13,16H2v-1h11V16z M15,19v-8l7,4L15,19z"></path></g>
</svg>
      </div>
      <div class="active-icon">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
<g id="like-filled"><path d="M15,19v-8l7,4L15,19z M22,7H2v2h20V7z M13,13H2v-2h11V13z M13,17H2v-2h11V17z"></path></g>
</svg>
      </div>
  </div>`,
        guideButton: `                    <div class="filled-icon">
<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" class="style-scope yt-icon"></path>
  </g></svg>
  </div>
  <div class="outline-icon">
  <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon"><path d="M21,6H3V5h18V6z M21,11H3v1h18V11z M21,17H3v1h18V17z" class="style-scope yt-icon"></path></g></svg>
  </div>`,
        logo: `                    <div id="ringo2-svg-logo">
<svg xmlns="http://www.w3.org/2000/svg" id="yt-ringo2-svg_yt12" width="93" height="20" viewBox="0 0 93 20" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;">
<g>
<path d="M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z" fill="#FF0033"></path>
<path d="M19 10L11.5 5.75V14.25L19 10Z" fill="white" id="ringo2-play"></path>
</g>
<g id="youtube-paths_yt12">
<path d="M37.1384 18.8999V13.4399L40.6084 2.09994H38.0184L36.6984 7.24994C36.3984 8.42994 36.1284 9.65994 35.9284 10.7999H35.7684C35.6584 9.79994 35.3384 8.48994 35.0184 7.22994L33.7384 2.09994H31.1484L34.5684 13.4399V18.8999H37.1384Z"></path>
<path d="M44.1003 6.29994C41.0703 6.29994 40.0303 8.04994 40.0303 11.8199V13.6099C40.0303 16.9899 40.6803 19.1099 44.0403 19.1099C47.3503 19.1099 48.0603 17.0899 48.0603 13.6099V11.8199C48.0603 8.44994 47.3803 6.29994 44.1003 6.29994ZM45.3903 14.7199C45.3903 16.3599 45.1003 17.3899 44.0503 17.3899C43.0203 17.3899 42.7303 16.3499 42.7303 14.7199V10.6799C42.7303 9.27994 42.9303 8.02994 44.0503 8.02994C45.2303 8.02994 45.3903 9.34994 45.3903 10.6799V14.7199Z"></path>
<path d="M52.2713 19.0899C53.7313 19.0899 54.6413 18.4799 55.3913 17.3799H55.5013L55.6113 18.8999H57.6012V6.53994H54.9613V16.4699C54.6812 16.9599 54.0312 17.3199 53.4212 17.3199C52.6512 17.3199 52.4113 16.7099 52.4113 15.6899V6.53994H49.7812V15.8099C49.7812 17.8199 50.3613 19.0899 52.2713 19.0899Z"></path>
<path d="M62.8261 18.8999V4.14994H65.8661V2.09994H57.1761V4.14994H60.2161V18.8999H62.8261Z"></path>
<path d="M67.8728 19.0899C69.3328 19.0899 70.2428 18.4799 70.9928 17.3799H71.1028L71.2128 18.8999H73.2028V6.53994H70.5628V16.4699C70.2828 16.9599 69.6328 17.3199 69.0228 17.3199C68.2528 17.3199 68.0128 16.7099 68.0128 15.6899V6.53994H65.3828V15.8099C65.3828 17.8199 65.9628 19.0899 67.8728 19.0899Z"></path>
<path d="M80.6744 6.26994C79.3944 6.26994 78.4744 6.82994 77.8644 7.73994H77.7344C77.8144 6.53994 77.8744 5.51994 77.8744 4.70994V1.43994H75.3244L75.3144 12.1799L75.3244 18.8999H77.5444L77.7344 17.6999H77.8044C78.3944 18.5099 79.3044 19.0199 80.5144 19.0199C82.5244 19.0199 83.3844 17.2899 83.3844 13.6099V11.6999C83.3844 8.25994 82.9944 6.26994 80.6744 6.26994ZM80.7644 13.6099C80.7644 15.9099 80.4244 17.2799 79.3544 17.2799C78.8544 17.2799 78.1644 17.0399 77.8544 16.5899V9.23994C78.1244 8.53994 78.7244 8.02994 79.3944 8.02994C80.4744 8.02994 80.7644 9.33994 80.7644 11.7299V13.6099Z"></path>
<path d="M92.6517 11.4999C92.6517 8.51994 92.3517 6.30994 88.9217 6.30994C85.6917 6.30994 84.9717 8.45994 84.9717 11.6199V13.7899C84.9717 16.8699 85.6317 19.1099 88.8417 19.1099C91.3817 19.1099 92.6917 17.8399 92.5417 15.3799L90.2917 15.2599C90.2617 16.7799 89.9117 17.3999 88.9017 17.3999C87.6317 17.3999 87.5717 16.1899 87.5717 14.3899V13.5499H92.6517V11.4999ZM88.8617 7.96994C90.0817 7.96994 90.1717 9.11994 90.1717 11.0699V12.0799H87.5717V11.0699C87.5717 9.13994 87.6517 7.96994 88.8617 7.96994Z"></path>
</g>
</svg>
  </div>
                    <div id="ringo-svg-logo">
<svg viewBox="0 0 200 60" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope ytd-topbar-logo-renderer"><g viewBox="0 0 200 60" preserveAspectRatio="xMidYMid meet" class="style-scope ytd-topbar-logo-renderer">
    <g class="style-scope ytd-topbar-logo-renderer">
      <path fill="#FF0000" d="M63,14.87c-0.72-2.7-2.85-4.83-5.56-5.56C52.54,8,32.88,8,32.88,8S13.23,8,8.32,9.31
        c-2.7,0.72-4.83,2.85-5.56,5.56C1.45,19.77,1.45,30,1.45,30s0,10.23,1.31,15.13c0.72,2.7,2.85,4.83,5.56,5.56
        C13.23,52,32.88,52,32.88,52s19.66,0,24.56-1.31c2.7-0.72,4.83-2.85,5.56-5.56C64.31,40.23,64.31,30,64.31,30
        S64.31,19.77,63,14.87z" class="style-scope ytd-topbar-logo-renderer"></path>
      <polygon fill="#FFFFFF" points="26.6,39.43 42.93,30 26.6,20.57" class="style-scope ytd-topbar-logo-renderer"></polygon>
    </g>
    <g class="style-scope ytd-topbar-logo-renderer">
      <g id="youtube-paths" class="style-scope ytd-topbar-logo-renderer">
        <path fill="#282828" d="M92.69,48.03c-1.24-0.84-2.13-2.14-2.65-3.91c-0.52-1.77-0.79-4.12-0.79-7.06v-4
          c0-2.97,0.3-5.35,0.9-7.15c0.6-1.8,1.54-3.11,2.81-3.93c1.27-0.82,2.94-1.24,5.01-1.24c2.04,0,3.67,0.42,4.9,1.26
          c1.23,0.84,2.13,2.15,2.7,3.93c0.57,1.78,0.85,4.16,0.85,7.12v4c0,2.94-0.28,5.3-0.83,7.08c-0.55,1.78-1.45,3.09-2.7,3.91
          c-1.24,0.82-2.93,1.24-5.06,1.24C95.65,49.29,93.93,48.87,92.69,48.03z M99.66,43.71c0.34-0.9,0.52-2.37,0.52-4.4v-8.59
          c0-1.98-0.17-3.42-0.52-4.34c-0.34-0.91-0.95-1.37-1.82-1.37c-0.84,0-1.43,0.46-1.78,1.37c-0.34,0.91-0.52,2.36-0.52,4.34v8.59
          c0,2.04,0.16,3.51,0.49,4.4c0.33,0.9,0.93,1.35,1.8,1.35C98.71,45.06,99.31,44.61,99.66,43.71z" class="style-scope ytd-topbar-logo-renderer"></path>
        <path fill="#282828" d="M188.16,37.13v1.39c0,1.77,0.05,3.09,0.16,3.98c0.1,0.88,0.32,1.53,0.65,1.93
          c0.33,0.4,0.84,0.61,1.53,0.61c0.93,0,1.57-0.36,1.91-1.08c0.34-0.72,0.53-1.92,0.56-3.6l5.35,0.31
          c0.03,0.24,0.04,0.57,0.04,0.99c0,2.55-0.7,4.45-2.09,5.71c-1.39,1.26-3.36,1.89-5.91,1.89c-3.06,0-5.2-0.96-6.43-2.88
          c-1.23-1.92-1.84-4.88-1.84-8.9v-4.81c0-4.14,0.64-7.15,1.91-9.06c1.27-1.9,3.45-2.85,6.54-2.85c2.13,0,3.76,0.39,4.9,1.17
          c1.14,0.78,1.94,1.99,2.41,3.64c0.46,1.65,0.7,3.93,0.7,6.83v4.72H188.16z M188.95,25.53c-0.31,0.39-0.52,1.03-0.63,1.91
          c-0.11,0.88-0.16,2.23-0.16,4.02v1.98h4.54v-1.98c0-1.77-0.06-3.11-0.18-4.02c-0.12-0.91-0.34-1.56-0.65-1.93
          c-0.31-0.37-0.8-0.56-1.46-0.56C189.75,24.94,189.26,25.14,188.95,25.53z" class="style-scope ytd-topbar-logo-renderer"></path>
        <path fill="#282828" d="M77.59,36.61l-7.06-25.49h6.16l2.47,11.55c0.63,2.85,1.09,5.27,1.39,7.28h0.18
          c0.21-1.44,0.67-3.85,1.39-7.24l2.56-11.6h6.16L83.7,36.61v12.23h-6.11V36.61z" class="style-scope ytd-topbar-logo-renderer"></path>
        <path fill="#282828" d="M126.45,21.28v27.55h-4.85l-0.54-3.37h-0.13c-1.32,2.55-3.3,3.82-5.93,3.82c-1.83,0-3.18-0.6-4.05-1.8
          c-0.87-1.2-1.3-3.07-1.3-5.62V21.28h6.2v20.23c0,1.23,0.13,2.11,0.4,2.63c0.27,0.52,0.72,0.79,1.35,0.79
          c0.54,0,1.06-0.16,1.55-0.49c0.49-0.33,0.86-0.75,1.1-1.26V21.28H126.45z" class="style-scope ytd-topbar-logo-renderer"></path>
        <path fill="#282828" d="M158.27,21.28v27.55h-4.85l-0.54-3.37h-0.13c-1.32,2.55-3.3,3.82-5.93,3.82c-1.83,0-3.18-0.6-4.05-1.8
          c-0.87-1.2-1.3-3.07-1.3-5.62V21.28h6.2v20.23c0,1.23,0.13,2.11,0.4,2.63c0.27,0.52,0.72,0.79,1.35,0.79
          c0.54,0,1.06-0.16,1.55-0.49c0.49-0.33,0.86-0.75,1.1-1.26V21.28H158.27z" class="style-scope ytd-topbar-logo-renderer"></path>
        <path fill="#282828" d="M143.31,16.11h-6.16v32.72h-6.07V16.11h-6.16v-4.99h18.38V16.11z" class="style-scope ytd-topbar-logo-renderer"></path>
        <path fill="#282828" d="M178.8,25.69c-0.38-1.74-0.98-3-1.82-3.78c-0.84-0.78-1.99-1.17-3.46-1.17c-1.14,0-2.2,0.32-3.19,0.97
          c-0.99,0.64-1.75,1.49-2.29,2.54h-0.05l0-14.52h-5.98v39.11h5.12l0.63-2.61h0.13c0.48,0.93,1.2,1.66,2.16,2.2
          c0.96,0.54,2.02,0.81,3.19,0.81c2.1,0,3.64-0.97,4.63-2.9c0.99-1.93,1.48-4.95,1.48-9.06v-4.36
          C179.36,29.84,179.17,27.43,178.8,25.69z M173.11,36.93c0,2.01-0.08,3.58-0.25,4.72c-0.16,1.14-0.44,1.95-0.83,2.43
          c-0.39,0.48-0.91,0.72-1.57,0.72c-0.51,0-0.98-0.12-1.42-0.36c-0.43-0.24-0.79-0.6-1.06-1.08V27.71
          c0.21-0.75,0.57-1.36,1.08-1.84c0.51-0.48,1.06-0.72,1.66-0.72c0.63,0,1.12,0.25,1.46,0.74c0.34,0.49,0.58,1.33,0.72,2.49
          c0.13,1.17,0.2,2.83,0.2,4.99V36.93z" class="style-scope ytd-topbar-logo-renderer"></path>
      </g>
    </g>
  </g></svg>
  </div>
<div id="classic-svg-logo">
<svg id="yt-logo-svg" class="external-icon">
<g id="yt-logo" viewBox="0 0 56 24" preserveaspetratio="xMidYMid meet">
  <path id="you-path" d="M20.9 19.3h-2.12v-1.24c-.8.94-1.5 1.4-2.23 1.4-.66 0-1.1-.3-1.34-.87-.12-.35-.22-.88-.22-1.67V7.9h2.12V17.16c.05.3.18.42.45.42.4 0 .78-.37 1.23-1V7.9h2.12v11.4M13.4 11.62c0-1.22-.23-2.13-.66-2.7-.56-.8-1.45-1.1-2.35-1.1-1.02 0-1.8.3-2.35 1.1-.44.57-.67 1.5-.67 2.7v4.07c0 1.2.2 2.04.64 2.6.56.8 1.48 1.2 2.37 1.2.9 0 1.82-.4 2.4-1.2.4-.56.6-1.4.6-2.6V11.6zm-2.1 4.3c.1 1.13-.25 1.7-.9 1.7-.66 0-1-.57-.9-1.7V11.4c-.1-1.13.24-1.66.9-1.66.65 0 1 .53.9 1.66v4.52zM5.03 13.1v6.2H2.8v-6.2S.47 5.46 0 4.04h2.35L3.92 10l1.56-5.95h2.34l-2.8 9.04"></path>
  <g id="tube-paths">
    <path d="M42.74 9.7c-.33 0-.7.2-1.05.52v6.86c.33.34.7.5 1.04.5.6 0 .85-.42.85-1.55v-4.86c0-1.13-.27-1.46-.86-1.46M51.08 11.07c0-1.05-.27-1.36-.94-1.36-.67 0-.96.3-.96 1.35v1.25h1.9v-1.23"></path>
    <path d="M55.67 5.28s-.33-2.3-1.33-3.33C53.07.6 51.64.6 51 .53 46.33.2 39.32.2 39.32.2h-.02s-7 0-11.67.33c-.65.08-2.08.08-3.35 1.42-1 1.02-1.32 3.33-1.32 3.33s-.34 2.72-.34 5.44v2.55c0 2.72.34 5.43.34 5.43s.32 2.32 1.32 3.34c1.27 1.34 2.94 1.3 3.68 1.43 2.67.26 11.35.34 11.35.34s7.03 0 11.7-.34c.65-.08 2.07-.08 3.34-1.42 1-1.02 1.33-3.34 1.33-3.34S56 16 56 13.27v-2.55c0-2.72-.33-5.44-.33-5.44zM29.95 19.3h-2.23v-13h-2.35V4.18h7.04V6.3h-2.45v13zm8.05 0h-2.12v-1.24c-.8.94-1.5 1.4-2.23 1.4-.66 0-1.1-.3-1.34-.87-.12-.35-.22-.88-.22-1.67V8h2.12v9.17c.05.3.18.42.45.42.4 0 .78-.37 1.23-1V8H38v11.3zm7.7-3.38c0 1.04-.07 1.78-.2 2.26-.28.84-.87 1.27-1.67 1.27-.72 0-1.46-.44-2.14-1.28v1.14h-2.02V4.18h2V9.1c.66-.8 1.4-1.27 2.15-1.27.8 0 1.34.47 1.6 1.3.15.47.28 1.2.28 2.27v4.52zm4.46 1.67c.5 0 .8-.28.9-.83.02-.1.02-.6.02-1.42h2.12v.32c0 .66-.05 1.13-.07 1.33-.07.46-.23.87-.47 1.23-.56.82-1.4 1.22-2.45 1.22-1.05 0-1.85-.38-2.44-1.16-.43-.57-.7-1.4-.7-2.6v-3.96c0-1.2.25-2.14.68-2.72.58-.77 1.4-1.18 2.42-1.18s1.82.4 2.4 1.18c.4.58.65 1.46.65 2.67V14H49.2v2.02c0 1.05.3 1.57.98 1.57z"></path>
  </g>
</g>
</svg>
</div>`
    },
    guideExpander: `                                <div class="startube-guide-expander yt-uix-expander yt-uix-expander-collapsed guide-channels-list">
                                    <div class="startube-guide-expander-items yt-uix-expander-body">
                                    <li class="guide-channel startube">
                                    <a class="startube-guide-expand-button flex-bar guide-item yt-uix-expander-head guide-view-more yt-valign">
                                    <span class="yt-valign-container startube-has-icon"><div class="st-svg thumb">
                    <div class="filled-icon">
<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
<g id="expand-less">
    <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"></path>
  </g>
  </svg>
  </div>
  <div class="outline-icon">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
<g id="collapse"><polygon points="18.4,14.6 12,8.3 5.6,14.6 6.4,15.4 12,9.7 17.6,15.4 "></polygon></g></svg>
  </div>
                    </div><span class="display-name no-count"><span>Show fewer</span></span></span>
  </a>
  </li>
                                    </div>
                                    <div class="yt-uix-expander-collapsed-body">
                                    <li class="guide-channel startube">
<a class="startube-guide-expand-button flex-bar guide-item yt-uix-expander-head guide-view-more yt-valign">
                                    <span class="yt-valign-container startube-has-icon"><div class="st-svg thumb">
                    <div class="filled-icon">
<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
<g id="expand">
    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
  </g>
  </svg>
  </div>
  <div class="outline-icon">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
<g id="expand"><path d="M12,15.7L5.6,9.4l0.7-0.7l5.6,5.6l5.6-5.6l0.7,0.7L12,15.7z"></path></g></svg>
  </div>
                    </div><span class="display-name no-count"><span>Show more</span></span></span>
  </a>
  </li>
                                    </div>
                                </div>`,
    guideFooter: `          <div id="guide-links-primary" class="style-scope ytd-guide-renderer">
  <a slot="guide-links-primary" href="https://www.youtube.com/about/" style="display: none;">About</a><a slot="guide-links-primary" href="https://www.youtube.com/about/press/" style="display: none;">Press</a><a slot="guide-links-primary" href="https://www.youtube.com/about/copyright/" style="display: none;">Copyright</a><a slot="guide-links-primary" href="https://www.youtube.com/t/contact_us/" style="display: none;">Contact us</a><a slot="guide-links-primary" href="https://www.youtube.com/creators/" style="display: none;">Creators</a><a slot="guide-links-primary" href="https://www.youtube.com/ads/" style="display: none;">Advertise</a><a slot="guide-links-primary" href="https://developers.google.com/youtube" style="display: none;">Developers</a>
</div>
<div id="guide-links-secondary" class="style-scope ytd-guide-renderer">
  <a slot="guide-links-secondary" href="https://www.youtube.com/t/terms" style="display: none;">Terms</a><a slot="guide-links-secondary" href="https://policies.google.com/privacy?hl=en" style="display: none;">Privacy</a><a slot="guide-links-secondary" href="https://www.youtube.com/about/policies/" style="display: none;">Policy &amp; Safety</a><a slot="guide-links-secondary" href="https://www.youtube.com/howyoutubeworks?utm_campaign=ytgen&amp;utm_source=ythp&amp;utm_medium=LeftNav&amp;utm_content=txt&amp;u=https%3A%2F%2Fwww.youtube.com%2Fhowyoutubeworks%3Futm_source%3Dythp%26utm_medium%3DLeftNav%26utm_campaign%3Dytgen" style="display: none;">How YouTube works</a><a slot="guide-links-secondary" href="https://www.youtube.com/new" style="display: none;">Test new features</a>
</div>
<div id="copyright" slot="copyright" style="display: none;"><div dir="ltr" style="display:inline">© 2026 Google LLC</div></div>`,
    autoplayHeader: `            <div class="st-rh-left flex-bar watch-sidebar-head">
                <div id="st-un-label" class="st-rh-label">
                    <span>Up next</span>
                </div>
                <div id="st-s-label" class="st-rh-label none">
                    <span>Suggestions</span>
                </div>
                <div id="st-r-label" class="st-rh-label none">
                    <span>Related</span>
                </div>
                <div id="st-rv-label" class="st-rh-label none">
                    <span>Related videos</span>
                </div>
                <div id="st-mv-label" class="st-rh-label none">
                    <span>More videos</span>
                </div>
            </div>
            <div class="st-rh-middle flex-bar">
            </div>
            <div class="st-rh-right flex-bar">
                <div id="st-ap-toggle-cont" class="st-rh-content flex-bar" show-card="false">
                    <div class="st-m-toggle-cont flex-bar">
                        <div class="st-m-toggle-label" id="st-ap-label">
                            <span>Autoplay</span>
                        </div>
                        <div class="st-m-toggle-info">
                            <div id="st-ap-hover">
                                <div class="st-svg">
<div class="filled-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
<div class="outline-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
</div>
                            </div>
                            <div id="st-ap-card-holder" class="st-m-toggle-card-outer">
                                <div class="st-fence" id="st-ap-fence"></div>
                                <div id="st-ap-card" class="yt-uix-hovercard-card yt-uix-hovercard-card-flip yt-uix-kbd-nav yt-uix-hovercard-card-reverse" data-kbd-nav-move-out="body" tabindex="-1"><div class="yt-uix-card-border-arrow yt-uix-card-border-arrow-vertical" style="right:6px;"></div><div class="yt-uix-hovercard-card-border"><div class="yt-uix-card-body-arrow yt-uix-card-body-arrow-vertical" style="right:6px;"></div><div class="yt-uix-hovercard-card-body"><span class="yt-uix-hovercard-card-content">When autoplay is enabled, a suggested video will automatically play next.</span></div></div></div>
                            </div>
                        </div>
                        <div class="st-m-toggle flex-bar" id="st-ap-tog">
                            <div class="st-m-toggle-inner flex-bar">
                                <div id="toggleBar"></div>
                                <div id="toggleButton"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="st-rg-toggle-cont" class="st-rh-content none">
                </div>
            </div>`,
    spinner: `<div class="ytp-spinner" data-layer="4"><div><div class="ytp-spinner-container"><div class="ytp-spinner-rotator"><div class="ytp-spinner-left"><div class="ytp-spinner-circle"></div></div><div class="ytp-spinner-right"><div class="ytp-spinner-circle"></div></div></div></div></div><div class="ytp-spinner-message" style="display: none;">If playback doesn't begin shortly, try restarting your device.</div></div>`,
    playerIcons: {
        playPause: `<svg width="100%" height="100%" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <path id="ytp-11" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z">
        <animate id="st-pausing" attributeType="XML" attributeName="d" fill="freeze" from="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z" to="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" dur="0.2s" keySplines=".4 0 1 1" repeatCount="1">
        </animate>
        <animate id="st-playing" attributeType="XML" attributeName="d" fill="freeze" from="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" to="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z" dur="0.2s" keySplines=".4 0 1 1" repeatCount="1">
        </animate>
    </path>
</svg>`,
        playPauseV1: `<svg width="100%" height="100%" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <path id="ytp-11" d="M11,10 L18,13.74 18,22.28 11,26 Z M18,13.74 L26,18 26,18 18,22.28 Z">
        <animate id="st-pausing" attributeType="XML" attributeName="d" fill="freeze" from="M11,10 L17,10 17,26 11,26 Z M20,10 L26,10 26,26 20,26 Z" to="M11,10 L18,13.74 18,22.28 11,26 Z M18,13.74 L26,18 26,18 18,22.28 Z" dur="0.2s" keySplines=".4 0 1 1" repeatCount="1">
        </animate>
        <animate id="st-playing" attributeType="XML" attributeName="d" fill="freeze" from="M11,10 L18,13.74 18,22.28 11,26 Z M18,13.74 L26,18 26,18 18,22.28 Z" to="M11,10 L17,10 17,26 11,26 Z M20,10 L26,10 26,26 20,26 Z" dur="0.2s" keySplines=".4 0 1 1" repeatCount="1">
        </animate>
    </path>
</svg>`,
        volume: `<div id="st-max">
<svg width="100%" height="100%" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path class="ytp-svg-shadow" d="M12.39,15.54 L10,15.54 L10,20.44 L12.4,20.44 L17,25.50 L17,10.48 L12.39,15.54 Z" opacity="1"></path><path class="ytp-svg-fill" d="M12.39,15.54 L10,15.54 L10,20.44 L12.4,20.44 L17,25.50 L17,10.48 L12.39,15.54 Z" opacity="1"></path><path class="ytp-svg-shadow" d="M22,17.99 C22,16.4 20.74,15.05 19,14.54 L19,21.44 C20.74,20.93 22,19.59 22,17.99 Z" opacity="1"></path><path class="ytp-svg-fill" d="M22,17.99 C22,16.4 20.74,15.05 19,14.54 L19,21.44 C20.74,20.93 22,19.59 22,17.99 Z" opacity="1"></path><path class="ytp-svg-shadow" d="M19,24.31 L19,26 C22.99,25.24 26,21.94 26,18 C26,14.05 22.99,10.75 19,10 L19,11.68 C22.01,12.41 24.24,14.84 24.24,18 C24.24,21.15 22.01,23.58 19,24.31 Z" opacity="1"></path><path class="ytp-svg-fill" d="M19,24.31 L19,26 C22.99,25.24 26,21.94 26,18 C26,14.05 22.99,10.75 19,10 L19,11.68 C22.01,12.41 24.24,14.84 24.24,18 C24.24,21.15 22.01,23.58 19,24.31 Z" opacity="1"></path></svg>
</div>
<div id="st-low">
<svg width="100%" height="100%" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path class="ytp-svg-shadow" d="M12.39,15.54 L10,15.54 L10,20.44 L12.4,20.44 L17,25.50 L17,10.48 L12.39,15.54 Z" opacity="1"></path><path class="ytp-svg-fill" d="M12.39,15.54 L10,15.54 L10,20.44 L12.4,20.44 L17,25.50 L17,10.48 L12.39,15.54 Z" opacity="1"></path><path class="ytp-svg-shadow" d="M22,17.99 C22,16.4 20.74,15.05 19,14.54 L19,21.44 C20.74,20.93 22,19.59 22,17.99 Z" opacity="1"></path><path class="ytp-svg-fill" d="M22,17.99 C22,16.4 20.74,15.05 19,14.54 L19,21.44 C20.74,20.93 22,19.59 22,17.99 Z" opacity="1"></path></svg>
</div>
<div id="st-muted">
<svg width="100%" height="100%" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path class="ytp-svg-shadow" d="M12.39,15.54 L10,15.54 L10,20.44 L12.4,20.44 L17,25.50 L17,10.48 L12.39,15.54 Z" opacity="1"></path><path class="ytp-svg-fill" d="M12.39,15.54 L10,15.54 L10,20.44 L12.4,20.44 L17,25.50 L17,10.48 L12.39,15.54 Z" opacity="1"></path><path class="ytp-svg-shadow" d="M19.63,15.92 L20.68,14.93 L22.81,16.94 L24.94,14.93 L26,15.92 L23.86,17.93 L26,19.93 L24.94,20.92 L22.81,18.92 L20.68,20.92 L19.63,19.93 L21.76,17.93 L19.63,15.92 Z" opacity="1"></path><path class="ytp-svg-fill" d="M19.63,15.92 L20.68,14.93 L22.81,16.94 L24.94,14.93 L26,15.92 L23.86,17.93 L26,19.93 L24.94,20.92 L22.81,18.92 L20.68,20.92 L19.63,19.93 L21.76,17.93 L19.63,15.92 Z" opacity="1"></path></svg>
</div>`,
        captions: `<svg class="ytp-subtitles-button-icon" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-17"></use><path d="M11,11 C9.89,11 9,11.9 9,13 L9,23 C9,24.1 9.89,25 11,25 L25,25 C26.1,25 27,24.1 27,23 L27,13 C27,11.9 26.1,11 25,11 L11,11 Z M17,17 L15.5,17 L15.5,16.5 L13.5,16.5 L13.5,19.5 L15.5,19.5 L15.5,19 L17,19 L17,20 C17,20.55 16.55,21 16,21 L13,21 C12.45,21 12,20.55 12,20 L12,16 C12,15.45 12.45,15 13,15 L16,15 C16.55,15 17,15.45 17,16 L17,17 L17,17 Z M24,17 L22.5,17 L22.5,16.5 L20.5,16.5 L20.5,19.5 L22.5,19.5 L22.5,19 L24,19 L24,20 C24,20.55 23.55,21 23,21 L20,21 C19.45,21 19,20.55 19,20 L19,16 C19,15.45 19.45,15 20,15 L23,15 C23.55,15 24,15.45 24,16 L24,17 L24,17 Z" fill="#fff" id="ytp-id-17"></path></svg>`,
        captionsV1: `<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><defs><path d="M9,24 L27,24 L27,12 L9,12 L9,24 Z M17.05,19.50 C16.91,19.79 16.72,20.04 16.49,20.24 C16.26,20.44 15.99,20.60 15.69,20.70 C15.38,20.81 15.04,20.86 14.67,20.86 C14.21,20.86 13.79,20.79 13.43,20.64 C13.06,20.48 12.75,20.27 12.5,20.01 C12.24,19.74 12.05,19.42 11.91,19.06 C11.78,18.70 11.71,18.31 11.71,17.89 C11.71,17.47 11.78,17.07 11.91,16.70 C12.05,16.34 12.24,16.02 12.5,15.74 C12.75,15.47 13.06,15.26 13.43,15.10 C13.79,14.95 14.21,14.87 14.67,14.87 C15.00,14.87 15.31,14.91 15.61,15.01 C15.90,15.10 16.16,15.23 16.40,15.40 C16.63,15.58 16.82,15.79 16.97,16.05 C17.13,16.31 17.22,16.60 17.26,16.93 L15.98,16.93 C15.96,16.79 15.91,16.66 15.83,16.54 C15.75,16.41 15.65,16.31 15.53,16.22 C15.42,16.13 15.28,16.06 15.14,16.01 C14.98,15.95 14.83,15.93 14.67,15.93 C14.37,15.93 14.12,15.98 13.91,16.09 C13.70,16.20 13.53,16.35 13.40,16.54 C13.27,16.72 13.18,16.93 13.12,17.17 C13.06,17.40 13.03,17.64 13.03,17.89 C13.03,18.14 13.06,18.37 13.12,18.60 C13.18,18.82 13.27,19.03 13.40,19.21 C13.53,19.39 13.70,19.54 13.91,19.65 C14.12,19.76 14.37,19.81 14.67,19.81 C15.07,19.81 15.39,19.70 15.61,19.46 C15.84,19.22 15.98,18.91 16.03,18.53 L17.31,18.53 C17.28,18.89 17.19,19.21 17.05,19.50 L17.05,19.50 Z M24.04,19.51 C23.90,19.80 23.72,20.04 23.49,20.24 C23.26,20.45 22.99,20.60 22.68,20.71 C22.37,20.82 22.03,20.87 21.66,20.87 C21.20,20.87 20.79,20.80 20.42,20.64 C20.05,20.49 19.74,20.28 19.49,20.01 C19.24,19.75 19.04,19.43 18.91,19.07 C18.77,18.71 18.70,18.32 18.70,17.90 C18.70,17.47 18.77,17.08 18.91,16.71 C19.04,16.34 19.24,16.02 19.49,15.75 C19.74,15.48 20.05,15.26 20.42,15.11 C20.79,14.95 21.20,14.88 21.66,14.88 C21.99,14.88 22.30,14.92 22.60,15.01 C22.89,15.10 23.16,15.24 23.39,15.41 C23.62,15.58 23.82,15.80 23.97,16.06 C24.12,16.31 24.21,16.61 24.25,16.94 L22.97,16.94 C22.95,16.79 22.90,16.66 22.82,16.54 C22.74,16.42 22.65,16.32 22.53,16.22 C22.41,16.13 22.27,16.06 22.13,16.01 C21.98,15.96 21.82,15.94 21.66,15.94 C21.36,15.94 21.11,15.99 20.90,16.10 C20.7,16.21 20.53,16.36 20.40,16.54 C20.27,16.73 20.17,16.94 20.11,17.17 C20.06,17.41 20.03,17.65 20.03,17.90 C20.03,18.14 20.06,18.38 20.11,18.60 C20.17,18.83 20.27,19.04 20.40,19.22 C20.53,19.40 20.7,19.55 20.90,19.66 C21.11,19.76 21.36,19.82 21.66,19.82 C22.06,19.82 22.38,19.70 22.61,19.47 C22.84,19.23 22.97,18.92 23.02,18.54 L24.30,18.54 C24.27,18.89 24.18,19.22 24.04,19.51 L24.04,19.51 Z" id="ytp-svg-8"></path></defs><use class="ytp-svg-shadow" xlink:href="#ytp-svg-8"></use><use class="ytp-svg-fill" xlink:href="#ytp-svg-8"></use></svg>`,
        settings: `<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-19"></use><path d="m 23.94,18.78 c .03,-0.25 .05,-0.51 .05,-0.78 0,-0.27 -0.02,-0.52 -0.05,-0.78 l 1.68,-1.32 c .15,-0.12 .19,-0.33 .09,-0.51 l -1.6,-2.76 c -0.09,-0.17 -0.31,-0.24 -0.48,-0.17 l -1.99,.8 c -0.41,-0.32 -0.86,-0.58 -1.35,-0.78 l -0.30,-2.12 c -0.02,-0.19 -0.19,-0.33 -0.39,-0.33 l -3.2,0 c -0.2,0 -0.36,.14 -0.39,.33 l -0.30,2.12 c -0.48,.2 -0.93,.47 -1.35,.78 l -1.99,-0.8 c -0.18,-0.07 -0.39,0 -0.48,.17 l -1.6,2.76 c -0.10,.17 -0.05,.39 .09,.51 l 1.68,1.32 c -0.03,.25 -0.05,.52 -0.05,.78 0,.26 .02,.52 .05,.78 l -1.68,1.32 c -0.15,.12 -0.19,.33 -0.09,.51 l 1.6,2.76 c .09,.17 .31,.24 .48,.17 l 1.99,-0.8 c .41,.32 .86,.58 1.35,.78 l .30,2.12 c .02,.19 .19,.33 .39,.33 l 3.2,0 c .2,0 .36,-0.14 .39,-0.33 l .30,-2.12 c .48,-0.2 .93,-0.47 1.35,-0.78 l 1.99,.8 c .18,.07 .39,0 .48,-0.17 l 1.6,-2.76 c .09,-0.17 .05,-0.39 -0.09,-0.51 l -1.68,-1.32 0,0 z m -5.94,2.01 c -1.54,0 -2.8,-1.25 -2.8,-2.8 0,-1.54 1.25,-2.8 2.8,-2.8 1.54,0 2.8,1.25 2.8,2.8 0,1.54 -1.25,2.8 -2.8,2.8 l 0,0 z" fill="#fff" id="ytp-id-19"></path></svg>`,
        settingsV1: `<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><defs><path d="M27,19.35 L27,16.65 L24.61,16.65 C24.44,15.79 24.10,14.99 23.63,14.28 L25.31,12.60 L23.40,10.69 L21.72,12.37 C21.01,11.90 20.21,11.56 19.35,11.38 L19.35,9 L16.65,9 L16.65,11.38 C15.78,11.56 14.98,11.90 14.27,12.37 L12.59,10.69 L10.68,12.60 L12.36,14.28 C11.89,14.99 11.55,15.79 11.38,16.65 L9,16.65 L9,19.35 L11.38,19.35 C11.56,20.21 11.90,21.01 12.37,21.72 L10.68,23.41 L12.59,25.32 L14.28,23.63 C14.99,24.1 15.79,24.44 16.65,24.61 L16.65,27 L19.35,27 L19.35,24.61 C20.21,24.44 21.00,24.1 21.71,23.63 L23.40,25.32 L25.31,23.41 L23.62,21.72 C24.09,21.01 24.43,20.21 24.61,19.35 L27,19.35 Z M18,22.05 C15.76,22.05 13.95,20.23 13.95,18 C13.95,15.76 15.76,13.95 18,13.95 C20.23,13.95 22.05,15.76 22.05,18 C22.05,20.23 20.23,22.05 18,22.05 L18,22.05 Z" id="ytp-svg-39"></path></defs><use class="ytp-svg-shadow" xlink:href="#ytp-svg-39"></use><use class="ytp-svg-fill" xlink:href="#ytp-svg-39"></use></svg>`,
        size: `<div id="st-large">
<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-272"></use><path d="m 28,11 0,14 -20,0 0,-14 z m -18,2 16,0 0,10 -16,0 0,-10 z" fill="#fff" fill-rule="evenodd" id="ytp-id-272"></path></svg>
</div>
<div id="st-small">
<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-246"></use><path d="m 26,13 0,10 -16,0 0,-10 z m -14,2 12,0 0,6 -12,0 0,-6 z" fill="#fff" fill-rule="evenodd" id="ytp-id-246"></path></svg>
</div>`,
        sizeV1: `<div id="st-large">
<svg width="100%" height="100%" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path id="ytp-1294" d="M8,11 L28,11 28,25 8,25 8,11 Z M11,14 L11,22 25,22 25,14 11,14 Z"></path></defs><use xlink:href="#ytp-1294" class="ytp-svg-shadow"></use><use xlink:href="#ytp-1294" class="ytp-svg-fill"></use></svg>
</div>
<div id="st-small">
<svg width="100%" height="100%" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path id="ytp-12" d="M10,13 L26,13 26,23 10,23 10,13 Z M13,16 L13,20 23,20 23,16 13,16 Z">
</path></defs><use xlink:href="#ytp-12" class="ytp-svg-shadow"></use><use xlink:href="#ytp-12" class="ytp-svg-fill"></use></svg>
</div>`,
        fullscreen: `<div id="st-enter">
<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><g class="ytp-fullscreen-button-corner-0"><use class="ytp-svg-shadow" xlink:href="#ytp-id-7"></use><path class="ytp-svg-fill" d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z" id="ytp-id-7"></path></g><g class="ytp-fullscreen-button-corner-1"><use class="ytp-svg-shadow" xlink:href="#ytp-id-8"></use><path class="ytp-svg-fill" d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z" id="ytp-id-8"></path></g><g class="ytp-fullscreen-button-corner-2"><use class="ytp-svg-shadow" xlink:href="#ytp-id-9"></use><path class="ytp-svg-fill" d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z" id="ytp-id-9"></path></g><g class="ytp-fullscreen-button-corner-3"><use class="ytp-svg-shadow" xlink:href="#ytp-id-10"></use><path class="ytp-svg-fill" d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z" id="ytp-id-10"></path></g></svg>
</div>
<div id="st-exit">
<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><g class="ytp-fullscreen-button-corner-2"><use class="ytp-svg-shadow" xlink:href="#ytp-id-44"></use><path class="ytp-svg-fill" d="m 14,14 -4,0 0,2 6,0 0,-6 -2,0 0,4 0,0 z" id="ytp-id-44"></path></g><g class="ytp-fullscreen-button-corner-3"><use class="ytp-svg-shadow" xlink:href="#ytp-id-45"></use><path class="ytp-svg-fill" d="m 22,14 0,-4 -2,0 0,6 6,0 0,-2 -4,0 0,0 z" id="ytp-id-45"></path></g><g class="ytp-fullscreen-button-corner-0"><use class="ytp-svg-shadow" xlink:href="#ytp-id-46"></use><path class="ytp-svg-fill" d="m 20,26 2,0 0,-4 4,0 0,-2 -6,0 0,6 0,0 z" id="ytp-id-46"></path></g><g class="ytp-fullscreen-button-corner-1"><use class="ytp-svg-shadow" xlink:href="#ytp-id-47"></use><path class="ytp-svg-fill" d="m 10,22 4,0 0,4 2,0 0,-6 -6,0 0,2 0,0 z" id="ytp-id-47"></path></g></svg>
</div>`,
        fullscreenV1: `<div id="st-enter">
<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><defs><path d="M7,16 L10,16 L10,13 L13,13 L13,10 L7,10 L7,16 Z" id="ytp-svg-12"></path><path d="M23,10 L23,13 L26,13 L26,16 L29,16 L29,10 L23,10 Z" id="ytp-svg-13"></path><path d="M23,23 L23,26 L29,26 L29,20 L26,20 L26,23 L23,23 Z" id="ytp-svg-14"></path><path d="M10,20 L7,20 L7,26 L13,26 L13,23 L10,23 L10,20 Z" id="ytp-svg-15"></path></defs><use class="ytp-svg-shadow ytp-fullscreen-button-corner-0" stroke="#000" stroke-opacity=".15" stroke-width="2px" xlink:href="#ytp-svg-12"></use><use class="ytp-svg-shadow ytp-fullscreen-button-corner-1" stroke="#000" stroke-opacity=".15" stroke-width="2px" xlink:href="#ytp-svg-13"></use><use class="ytp-svg-shadow ytp-fullscreen-button-corner-2" stroke="#000" stroke-opacity=".15" stroke-width="2px" xlink:href="#ytp-svg-14"></use><use class="ytp-svg-shadow ytp-fullscreen-button-corner-3" stroke="#000" stroke-opacity=".15" stroke-width="2px" xlink:href="#ytp-svg-15"></use><use class="ytp-svg-fill ytp-fullscreen-button-corner-0" fill="#fff" xlink:href="#ytp-svg-12"></use><use class="ytp-svg-fill ytp-fullscreen-button-corner-1" fill="#fff" xlink:href="#ytp-svg-13"></use><use class="ytp-svg-fill ytp-fullscreen-button-corner-2" fill="#fff" xlink:href="#ytp-svg-14"></use><use class="ytp-svg-fill ytp-fullscreen-button-corner-3" fill="#fff" xlink:href="#ytp-svg-15"></use></svg>
</div>
<div id="st-exit">
<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><defs><path d="M13,10 L10,10 L10,13 L7,13 L7,16 L13,16 L13,10 Z" id="ytp-svg-16"></path><path d="M29,16 L29,13 L26,13 L26,10 L23,10 L23,16 L29,16 Z" id="ytp-svg-17"></path><path d="M29,23 L29,20 L23,20 L23,26 L26,26 L26,23 L29,23 Z" id="ytp-svg-18"></path><path d="M10,26 L13,26 L13,20 L7,20 L7,23 L10,23 L10,26 Z" id="ytp-svg-19"></path></defs><use class="ytp-svg-shadow ytp-fullscreen-close-button-corner-0" stroke="#000" stroke-opacity=".15" stroke-width="2px" xlink:href="#ytp-svg-16"></use><use class="ytp-svg-shadow ytp-fullscreen-close-button-corner-1" stroke="#000" stroke-opacity=".15" stroke-width="2px" xlink:href="#ytp-svg-17"></use><use class="ytp-svg-shadow ytp-fullscreen-close-button-corner-2" stroke="#000" stroke-opacity=".15" stroke-width="2px" xlink:href="#ytp-svg-18"></use><use class="ytp-svg-shadow ytp-fullscreen-close-button-corner-3" stroke="#000" stroke-opacity=".15" stroke-width="2px" xlink:href="#ytp-svg-19"></use><use class="ytp-svg-fill ytp-fullscreen-close-button-corner-0" fill="#fff" xlink:href="#ytp-svg-16"></use><use class="ytp-svg-fill ytp-fullscreen-close-button-corner-1" fill="#fff" xlink:href="#ytp-svg-17"></use><use class="ytp-svg-fill ytp-fullscreen-close-button-corner-2" fill="#fff" xlink:href="#ytp-svg-18"></use><use class="ytp-svg-fill ytp-fullscreen-close-button-corner-3" fill="#fff" xlink:href="#ytp-svg-19"></use></svg>
</div>`,
        watchLater: `<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><defs><path d="M18,8 C12.47,8 8,12.47 8,18 C8,23.52 12.47,28 18,28 C23.52,28 28,23.52 28,18 C28,12.47 23.52,8 18,8 L18,8 Z M16,19.02 L16,12.00 L18,12.00 L18,17.86 L23.10,20.81 L22.10,22.54 L16,19.02 Z" id="ytp-svg-52"></path></defs><use class="ytp-svg-shadow" xlink:href="#ytp-svg-52"></use><use class="ytp-svg-fill" xlink:href="#ytp-svg-52"></use></svg>`,
        share: `<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><defs><path d="m 20.20,14.19 0,-4.45 7.79,7.79 -7.79,7.79 0,-4.56 C 16.27,20.69 12.10,21.81 9.34,24.76 8.80,25.13 7.60,27.29 8.12,25.65 9.08,21.32 11.80,17.18 15.98,15.38 c 1.33,-0.60 2.76,-0.98 4.21,-1.19 z" id="ytp-svg-40"></path></defs><use class="ytp-svg-shadow" xlink:href="#ytp-svg-40"></use><use class="ytp-svg-fill" xlink:href="#ytp-svg-40"></use></svg>`,
        prev: `<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-11"></use><path class="ytp-svg-fill" d="m 12,12 h 2 v 12 h -2 z m 3.5,6 8.5,6 V 12 z" id="ytp-id-11"></path></svg>`,
        prevV1: `<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><defs><path d="M19.8,12.5 L19.8,16.49 L27,12.5 L27,23.5 L19.8,19.50 L19.8,23.5 L11.5,19.1 L11.5,23.5 L9,23.5 L9,12.5 L11.5,12.5 L11.5,17.45 L19.8,12.5 Z" id="ytp-svg-36"></path></defs><use class="ytp-svg-shadow" xlink:href="#ytp-svg-36"></use><use class="ytp-svg-fill" xlink:href="#ytp-svg-36"></use></svg>`,
        next: `<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-13"></use><path class="ytp-svg-fill" d="M 12,24 20.5,18 12,12 V 24 z M 22,12 v 12 h 2 V 12 h -2 z" id="ytp-id-13"></path></svg>`,
        nextV1: `<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><defs><path d="M16.2,12.5 L16.2,16.49 L9,12.5 L9,23.5 L16.2,19.50 L16.2,23.5 L24.5,19.1 L24.5,23.5 L27,23.5 L27,12.5 L24.5,12.5 L24.5,17.45 L16.2,12.5 Z" id="ytp-svg-31"></path></defs><use class="ytp-svg-shadow" xlink:href="#ytp-svg-31"></use><use class="ytp-svg-fill" xlink:href="#ytp-svg-31"></use></svg>`,
        menu: `                        <div class="st-plm">
                            <div class="st-plm-inner flex">
                                <div id="st-main-page" class="st-plm-page">
                                    <div class="st-plm-page-inner">
                                        <div class="st-plm-content">
                                            <button class="st-pl-menuitem st-pl-autoplay flex-bar st-pl-toggle st-valid-tog flex-bar" toggle="autoplay">
                                                <span class="ytp-menu-cell ytp-menu-title st-valid-tog">Autoplay</span>
                                                <div class="st-m-toggle flex-bar st-valid-tog" id="st-pl-ap-tog">
                                                    <div class="st-m-toggle-inner flex-bar st-valid-tog">
                                                        <div id="toggleBar" class="st-valid-tog"></div>
                                                        <div id="toggleButton" class="st-valid-tog"></div>
                                                    </div>
                                                </div>
                                            </button>
                                            <button class="st-pl-menuitem st-pl-annotations flex-bar st-pl-toggle st-valid-tog flex-bar" toggle="annotations">
                                                <span class="ytp-menu-cell ytp-menu-title st-valid-tog">Annotations</span>
                                                <div class="st-m-toggle flex-bar st-valid-tog" id="st-pl-an-tog">
                                                    <div class="st-m-toggle-inner flex-bar st-valid-tog">
                                                        <div id="toggleBar" class="st-valid-tog"></div>
                                                        <div id="toggleButton" class="st-valid-tog"></div>
                                                    </div>
                                                </div>
                                            </button>
                                            <button class="st-pl-menuitem st-pl-miniplayer flex-bar st-pl-toggle st-valid-tog flex-bar" toggle="miniplayer">
                                                <span class="ytp-menu-cell ytp-menu-title st-valid-tog">Miniplayer</span>
                                                <div class="st-m-toggle flex-bar st-valid-tog" id="st-pl-an-tog">
                                                    <div class="st-m-toggle-inner flex-bar st-valid-tog">
                                                        <div id="toggleBar" class="st-valid-tog"></div>
                                                        <div id="toggleButton" class="st-valid-tog"></div>
                                                    </div>
                                                </div>
                                            </button>
                                            <button class="st-pl-menuitem st-pl-submenu-btn st-pl-speed st-pl-trigger flex-bar" trigger="speed">
                                            </button>
                                            <button class="st-pl-menuitem st-pl-submenu-btn st-pl-subtitles st-pl-trigger flex-bar" trigger="subtitles">
                                            </button>
                                            <button class="st-pl-menuitem st-pl-submenu-btn st-pl-audio-track st-pl-trigger flex-bar" trigger="audio-track">
                                            </button>
                                            <button class="st-pl-menuitem st-pl-submenu-btn st-pl-quality st-pl-trigger flex-bar" trigger="quality">
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div id="st-speed-page" class="st-plm-page">
                                    <div class="st-plm-page-inner">
                                        <div class="st-plm-header flex-bar">
                                            <button class="st-plm-back st-pl-trigger flex-bar" trigger="main">
                                                <div class="st-pl-back-icon">
<div class="st-svg">
<div class="filled-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
<div class="outline-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
</div>
</div>
                                                <span class="st-plm-text">Playback speed</span>
                                            </button>
                                        </div>
                                        <div class="st-plm-content">
                                        </div>
                                    </div>
                                </div>
                                <div id="st-quality-page" class="st-plm-page">
                                    <div class="st-plm-page-inner">
                                        <div class="st-plm-header flex-bar">
                                            <button class="st-plm-back st-pl-trigger flex-bar" trigger="main">
                                                <div class="st-pl-back-icon">
<div class="st-svg">
<div class="filled-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
<div class="outline-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
</div>
</div>
                                                <span class="st-plm-text">Quality</span>
                                            </button>
                                        </div>
                                        <div class="st-plm-content">
                                        </div>
                                    </div>
                                </div>
                                <div id="st-subtitles-page" class="st-plm-page">
                                    <div class="st-plm-page-inner">
                                        <div class="st-plm-header flex-bar">
                                            <button class="st-plm-back st-pl-trigger flex-bar" trigger="main">
                                                <div class="st-pl-back-icon">
<div class="st-svg">
<div class="filled-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
<div class="outline-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
</div>
</div>
                                                <span class="st-plm-text">Subtitles</span>
                                            </button>
                                        </div>
                                        <div class="st-plm-content">
                                        </div>
                                    </div>
                                </div>
                                <div id="st-audio-track-page" class="st-plm-page">
                                    <div class="st-plm-page-inner">
                                        <div class="st-plm-header flex-bar">
                                            <button class="st-plm-back st-pl-trigger flex-bar" trigger="main">
                                                <div class="st-pl-back-icon">
<div class="st-svg">
<div class="filled-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
<div class="outline-icon">
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
        <g>
            <path>
            </path>
        </g>
    </svg>
</div>
</div>
</div>
                                                <span class="st-plm-text">Audio track</span>
                                            </button>
                                        </div>
                                        <div class="st-plm-content">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`
    },
    accountMenu: `                    <div class="yt-uix-card-body-arrow yt-uix-card-body-arrow-vertical" style="right: 8.5px;"></div>
                <div id="st-account-menu-inner">
                    <div id="st-polymer-menu">
                        <div id="st-polymer-menu-main-header" class="st-polymer-menu-header flex-bar">
                            <div id="st-polymer-menu-pfp">
                                <img></img>
                            </div>
                            <div id="st-polymer-menu-details">
                                <div id="st-polymer-menu-username">
                                    <span></span>
                                </div>
                                <div id="st-polymer-menu-email">
                                    <span></span>
                                </div>
                                <a id="st-polymer-menu-google-account" href="https://www.google.com/account">
                                    <span>Manage your Google Account</span>
                                </a>
                            </div>
                        </div>
                        <div id="st-polymer-menu-account-header" class="st-polymer-menu-header flex-bar">
                            <div id="st-polymer-menu-back" class="st-icon-button flex-bar">
                                <div class="st-svg">
                                    <div class="filled-icon">
                                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g mirror-in-rtl="" class="style-scope yt-icon">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" class="style-scope yt-icon"></path>
  </g></svg>
                                    </div>
                                    <div class="outline-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="M21 11v1H5.64l6.72 6.72-.71.71-7.93-7.93 7.92-7.92.71.71L5.64 11H21z"></path></svg>
                                    </div>
                                </div>
                            </div>
                            <div class="st-polymer-menu-header-text">
                                <span>Accounts</span>
                            </div>
                        </div>
                        <div id="st-polymer-menu-appearance-header" class="st-polymer-menu-header flex-bar">
                            <div id="st-polymer-menu-back" class="st-icon-button flex-bar">
                                <div class="st-svg">
                                    <div class="filled-icon">
                                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g mirror-in-rtl="" class="style-scope yt-icon">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" class="style-scope yt-icon"></path>
  </g></svg>
                                    </div>
                                    <div class="outline-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="M21 11v1H5.64l6.72 6.72-.71.71-7.93-7.93 7.92-7.92.71.71L5.64 11H21z"></path></svg>
                                    </div>
                                </div>
                            </div>
                            <div class="st-polymer-menu-header-text">
                                <span>Dark theme</span>
                            </div>
                        </div>
                        </div>
                        <div id="st-polymer-menu-content">
                            <div class="st-polymer-menu-section">
                                <a id="st-polymer-my-channel" class="st-polymer-menu-item flex-bar">
                                    <div class="st-svg st-polymer-menu-svg">
                                        <div class="filled-icon">
                                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
    <path d="M3 5v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z" class="style-scope yt-icon"></path>
  </g></svg>
                                        </div>
                                        <div class="outline-icon">
                                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
      <g id="account_box"><path d="M3,3v18h18V3H3z M4.99,20c0.39-2.62,2.38-5.1,7.01-5.1s6.62,2.48,7.01,5.1H4.99z M9,10c0-1.65,1.35-3,3-3s3,1.35,3,3 c0,1.65-1.35,3-3,3S9,11.65,9,10z M12.72,13.93C14.58,13.59,16,11.96,16,10c0-2.21-1.79-4-4-4c-2.21,0-4,1.79-4,4 c0,1.96,1.42,3.59,3.28,3.93c-4.42,0.25-6.84,2.8-7.28,6V4h16v15.93C19.56,16.73,17.14,14.18,12.72,13.93z"></path></g>
      </g></svg>
                                        </div>
                                    </div>
                                    <span>My Channel</span>
                                </a>
                                <a id="st-polymer-purchases" class="st-polymer-menu-item flex-bar" href="/paid_memberships">
                                    <div class="st-svg st-polymer-menu-svg">
                                        <div class="filled-icon">
                                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
<g id="purchases">
    <path d="M19.84 11.65l-7.5-7.5c-.3-.3-.7-.48-1.17-.48H5.33c-.9 0-1.66.75-1.66 1.66v5.84c0 .45.18.87.5 1.18l7.5 7.5c.3.3.7.48 1.16.48.46 0 .88-.18 1.18-.5L19.87 14c.3-.3.5-.7.5-1.16 0-.46-.2-.88-.5-1.18zM6.58 7.83c-.7 0-1.25-.55-1.25-1.25s.56-1.25 1.25-1.25c.7 0 1.25.56 1.25 1.25 0 .7-.55 1.25-1.25 1.25z"></path>
  </g></svg>
                                        </div>
                                        <div class="outline-icon">
                                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g id="purchases"><path d="M5.02,6.75C4.88,5.93,5.44,5.16,6.25,5.02s1.59,0.41,1.73,1.23c0.14,0.82-0.41,1.59-1.23,1.73 C5.93,8.12,5.16,7.56,5.02,6.75z M3.99,4L4,11.08l9.36,9.36l7.07-7.07l-9.36-9.36L3.99,4 M2.99,3l8.49,0.01l10.36,10.36l-8.49,8.49 L3,11.49L2.99,3L2.99,3z"></path></g></svg>
                                        </div>
                                    </div>
                                    <span>Purchases</span>
                                </a>
                                <a id="st-polymer-studio" class="st-polymer-menu-item flex-bar" href="https://studio.youtube.com">
                                    <div class="st-svg st-polymer-menu-svg">
                                        <div class="filled-icon">
                                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
                                        <g id="creator_studio">
    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM10 15V9l5 3-5 3z"></path>
  </g></svg>
                                        </div>
                                        <div class="outline-icon">
                                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
      <g><path d="M10,9l5.2,3L10,15V9z M13.22,3h-2.44l-0.55,2.2L10.1,5.71L9.61,5.9C9,6.12,8.42,6.45,7.88,6.88L7.48,7.2l-0.5-0.14 L4.82,6.44L3.6,8.56l1.63,1.59l0.37,0.36l-0.08,0.51C5.47,11.34,5.44,11.67,5.44,12s0.03,0.66,0.08,0.98l0.08,0.51l-0.37,0.36 L3.6,15.44l1.22,2.11l2.17-0.62l0.5-0.14l0.4,0.32C8.42,17.55,9,17.88,9.61,18.1l0.5,0.18l0.13,0.51l0.55,2.2h2.44l0.55-2.2 l0.13-0.51l0.5-0.18c0.61-0.23,1.19-0.56,1.72-0.98l0.4-0.32l0.5,0.14l2.17,0.62l1.22-2.11l-1.63-1.59l-0.37-0.36l0.08-0.51 c0.05-0.32,0.08-0.64,0.08-0.98s-0.03-0.66-0.08-0.98l-0.08-0.51l0.37-0.36l1.63-1.59l-1.22-2.11l-2.17,0.62l-0.5,0.14l-0.4-0.32 C15.58,6.45,15,6.12,14.39,5.9l-0.5-0.18L13.77,5.2L13.22,3 M14,2l0.74,2.96c0.73,0.27,1.4,0.66,2,1.14l2.92-0.83l2,3.46l-2.19,2.13 c0.06,0.37,0.09,0.75,0.09,1.14s-0.03,0.77-0.09,1.14l2.19,2.13l-2,3.46l-2.92-0.83c-0.6,0.48-1.27,0.87-2,1.14L14,22h-4l-0.74-2.96 c-0.73-0.27-1.4-0.66-2-1.14l-2.92,0.83l-2-3.46l2.19-2.13C4.47,12.77,4.44,12.39,4.44,12s0.03-0.77,0.09-1.14L2.34,8.73l2-3.46 L7.26,6.1c0.6-0.48,1.27-0.87,2-1.14L10,2H14L14,2z"></path></g>
      </g></svg>
                                        </div>
                                    </div>
                                    <span>Creator Studio</span>
                                </a>
                                <a id="st-polymer-switch-account" class="st-polymer-menu-item flex-bar">
                                    <div class="st-svg st-polymer-menu-svg">
                                        <div class="filled-icon">
                                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
<g id="switch_accounts">
    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h12zm-3 5c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3zm-9 8v1h12v-1c0-2-4-3.1-6-3.1S8 13 8 15z"></path>
  </g>
  </svg>
                                        </div>
                                        <div class="outline-icon">
                                       <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="M4 20h14v1H3V6h1v14zM6 3v15h15V3H6zm2.02 14c.36-2.13 1.93-4.1 5.48-4.1s5.12 1.97 5.48 4.1H8.02zM11 8.5a2.5 2.5 0 015 0 2.5 2.5 0 01-5 0zm3.21 3.43A3.507 3.507 0 0017 8.5C17 6.57 15.43 5 13.5 5S10 6.57 10 8.5c0 1.69 1.2 3.1 2.79 3.43-3.48.26-5.4 2.42-5.78 5.07H7V4h13v13h-.01c-.38-2.65-2.31-4.81-5.78-5.07z"></path></svg> </div>
                                    </div>
                                    <span>Switch account</span>
                                    <div class="st-svg st-polymer-menu-right-svg">
                                        <div class="filled-icon">
                                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
                                        <g id="chevron_right" mirror-in-rtl="">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
  </g>
                                        </div>
                                        <div class="outline-icon">
                                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
                                        <g mirror-in-rtl="" id="chevron_right"><path d="M9.4,18.4l-0.7-0.7l5.6-5.6L8.6,6.4l0.7-0.7l6.4,6.4L9.4,18.4z"></path></g></svg>
                                        </div>
                                    </div>
                                </a>
                                <a id="st-polymer-logout" class="st-polymer-menu-item flex-bar" href="/logout">
                                    <div class="st-svg st-polymer-menu-svg">
                                        <div class="filled-icon">
                                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
<g id="exit_app">
    <path d="M0 0h24v24H0z" fill="none"></path>
    <path d="M10.1 15.6l1.4 1.4 5-5-5-5-1.4 1.4 2.57 2.6H3v2h9.67l-2.58 2.6zM19 3H5c-1.1 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
  </g>
  </svg>
                                        </div>
                                        <div class="outline-icon">
                                       <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="M20 3v18H8v-1h11V4H8V3h12zm-8.9 12.1.7.7 4.4-4.4L11.8 7l-.7.7 3.1 3.1H3v1h11.3l-3.2 3.3z"></path></svg>
                                        </div>
                                    </div>
                                    <span>Sign out</span>
                                </a>
                            </div>
                            <div class="st-polymer-menu-section">
                                <a id="st-polymer-appearance" class="st-polymer-menu-item flex-bar">
                                    <div class="st-svg st-polymer-menu-svg">
                                        <div class="filled-icon">
                                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
<g>
        <path d="M280.485281,201.514719 L284,198 L287.514719,201.514719 L292.485281,201.514719 L292.485281,206.485281 L296,210 L292.485281,213.514719 L292.485281,218.485281 L287.514719,218.485281 L284,222 L280.485281,218.485281 L275.514719,218.485281 L275.514719,213.514719 L272,210 L275.514719,206.485281 L275.514719,201.514719 L280.485281,201.514719 Z M283.726536,215.86375 C287.116026,215.86375 289.86375,213.251451 289.86375,210.029016 C289.86375,206.806581 287.116026,204.194281 283.726536,204.194281 C283.073662,204.194281 282.164855,204.396254 281.000116,204.800201 C282.532112,206.378393 283.29811,208.121331 283.29811,210.029016 C283.29811,211.9367 282.444938,213.635948 280.738594,215.126758 C282.007413,215.618086 283.003393,215.86375 283.726536,215.86375 Z" transform="translate(-272, -198)" class="style-scope yt-icon"></path>
      </g>
  </svg>
                                        </div>
                                        <div class="outline-icon">
                                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
                                        <g><path d="M12 22C10.93 22 9.86998 21.83 8.83998 21.48L7.41998 21.01L8.83998 20.54C12.53 19.31 15 15.88 15 12C15 8.12 12.53 4.69 8.83998 3.47L7.41998 2.99L8.83998 2.52C9.86998 2.17 10.93 2 12 2C17.51 2 22 6.49 22 12C22 17.51 17.51 22 12 22ZM10.58 20.89C11.05 20.96 11.53 21 12 21C16.96 21 21 16.96 21 12C21 7.04 16.96 3 12 3C11.53 3 11.05 3.04 10.58 3.11C13.88 4.81 16 8.21 16 12C16 15.79 13.88 19.19 10.58 20.89Z""></path></g>
      </svg>
                                        </div>
                                    </div>
                                    <span>Dark theme</span>
                                    <div class="st-svg st-polymer-menu-right-svg">
                                        <div class="filled-icon">
                                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
                                        <g id="chevron_right" mirror-in-rtl="">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
  </g>
                                        </div>
                                        <div class="outline-icon">
                                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
                                        <g mirror-in-rtl="" id="chevron_right"><path d="M9.4,18.4l-0.7-0.7l5.6-5.6L8.6,6.4l0.7-0.7l6.4,6.4L9.4,18.4z"></path></g></svg>
                                        </div>
                                    </div>
                                </a>
                                <a id="st-polymer-settings" class="st-polymer-menu-item flex-bar" href="/account">
                                    <div class="st-svg st-polymer-menu-svg">
                                        <div class="filled-icon">
                                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
<g id="settings_material">
    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.1-1.65c.2-.15.25-.42.13-.64l-2-3.46c-.12-.22-.4-.3-.6-.22l-2.5 1c-.52-.4-1.08-.73-1.7-.98l-.37-2.65c-.06-.24-.27-.42-.5-.42h-4c-.27 0-.48.18-.5.42l-.4 2.65c-.6.25-1.17.6-1.7.98l-2.48-1c-.23-.1-.5 0-.6.22l-2 3.46c-.14.22-.08.5.1.64l2.12 1.65c-.04.32-.07.65-.07.98s.02.66.06.98l-2.1 1.65c-.2.15-.25.42-.13.64l2 3.46c.12.22.4.3.6.22l2.5-1c.52.4 1.08.73 1.7.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.6-.25 1.17-.6 1.7-.98l2.48 1c.23.1.5 0 .6-.22l2-3.46c.13-.22.08-.5-.1-.64l-2.12-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path>
  </g>
  </svg>
                                        </div>
                                        <div class="outline-icon">
                                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
                                        <g id="settings"><path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,8c-2.21,0-4,1.79-4,4s1.79,4,4,4s4-1.79,4-4 S14.21,8,12,8L12,8z M13.22,3l0.55,2.2l0.13,0.51l0.5,0.18c0.61,0.23,1.19,0.56,1.72,0.98l0.4,0.32l0.5-0.14l2.17-0.62l1.22,2.11 l-1.63,1.59l-0.37,0.36l0.08,0.51c0.05,0.32,0.08,0.64,0.08,0.98s-0.03,0.66-0.08,0.98l-0.08,0.51l0.37,0.36l1.63,1.59l-1.22,2.11 l-2.17-0.62l-0.5-0.14l-0.4,0.32c-0.53,0.43-1.11,0.76-1.72,0.98l-0.5,0.18l-0.13,0.51L13.22,21h-2.44l-0.55-2.2l-0.13-0.51 l-0.5-0.18C9,17.88,8.42,17.55,7.88,17.12l-0.4-0.32l-0.5,0.14l-2.17,0.62L3.6,15.44l1.63-1.59l0.37-0.36l-0.08-0.51 C5.47,12.66,5.44,12.33,5.44,12s0.03-0.66,0.08-0.98l0.08-0.51l-0.37-0.36L3.6,8.56l1.22-2.11l2.17,0.62l0.5,0.14l0.4-0.32 C8.42,6.45,9,6.12,9.61,5.9l0.5-0.18l0.13-0.51L10.78,3H13.22 M14,2h-4L9.26,4.96c-0.73,0.27-1.4,0.66-2,1.14L4.34,5.27l-2,3.46 l2.19,2.13C4.47,11.23,4.44,11.61,4.44,12s0.03,0.77,0.09,1.14l-2.19,2.13l2,3.46l2.92-0.83c0.6,0.48,1.27,0.87,2,1.14L10,22h4 l0.74-2.96c0.73-0.27,1.4-0.66,2-1.14l2.92,0.83l2-3.46l-2.19-2.13c0.06-0.37,0.09-0.75,0.09-1.14s-0.03-0.77-0.09-1.14l2.19-2.13 l-2-3.46L16.74,6.1c-0.6-0.48-1.27-0.87-2-1.14L14,2L14,2z"></path></g>
      </svg>
                                        </div>
                                    </div>
                                    <span>Settings</span>
                                </a>
                                <a id="st-polymer-v3-settings" class="st-polymer-menu-item flex-bar none">
                                    <div class="st-svg st-polymer-menu-svg">
                                        <div class="filled-icon">
                                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
<g id="settings_material">
    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.1-1.65c.2-.15.25-.42.13-.64l-2-3.46c-.12-.22-.4-.3-.6-.22l-2.5 1c-.52-.4-1.08-.73-1.7-.98l-.37-2.65c-.06-.24-.27-.42-.5-.42h-4c-.27 0-.48.18-.5.42l-.4 2.65c-.6.25-1.17.6-1.7.98l-2.48-1c-.23-.1-.5 0-.6.22l-2 3.46c-.14.22-.08.5.1.64l2.12 1.65c-.04.32-.07.65-.07.98s.02.66.06.98l-2.1 1.65c-.2.15-.25.42-.13.64l2 3.46c.12.22.4.3.6.22l2.5-1c.52.4 1.08.73 1.7.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.6-.25 1.17-.6 1.7-.98l2.48 1c.23.1.5 0 .6-.22l2-3.46c.13-.22.08-.5-.1-.64l-2.12-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path>
  </g>
  </svg>
                                        </div>
                                        <div class="outline-icon">
                                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
                                        <g id="settings"><path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,8c-2.21,0-4,1.79-4,4s1.79,4,4,4s4-1.79,4-4 S14.21,8,12,8L12,8z M13.22,3l0.55,2.2l0.13,0.51l0.5,0.18c0.61,0.23,1.19,0.56,1.72,0.98l0.4,0.32l0.5-0.14l2.17-0.62l1.22,2.11 l-1.63,1.59l-0.37,0.36l0.08,0.51c0.05,0.32,0.08,0.64,0.08,0.98s-0.03,0.66-0.08,0.98l-0.08,0.51l0.37,0.36l1.63,1.59l-1.22,2.11 l-2.17-0.62l-0.5-0.14l-0.4,0.32c-0.53,0.43-1.11,0.76-1.72,0.98l-0.5,0.18l-0.13,0.51L13.22,21h-2.44l-0.55-2.2l-0.13-0.51 l-0.5-0.18C9,17.88,8.42,17.55,7.88,17.12l-0.4-0.32l-0.5,0.14l-2.17,0.62L3.6,15.44l1.63-1.59l0.37-0.36l-0.08-0.51 C5.47,12.66,5.44,12.33,5.44,12s0.03-0.66,0.08-0.98l0.08-0.51l-0.37-0.36L3.6,8.56l1.22-2.11l2.17,0.62l0.5,0.14l0.4-0.32 C8.42,6.45,9,6.12,9.61,5.9l0.5-0.18l0.13-0.51L10.78,3H13.22 M14,2h-4L9.26,4.96c-0.73,0.27-1.4,0.66-2,1.14L4.34,5.27l-2,3.46 l2.19,2.13C4.47,11.23,4.44,11.61,4.44,12s0.03,0.77,0.09,1.14l-2.19,2.13l2,3.46l2.92-0.83c0.6,0.48,1.27,0.87,2,1.14L10,22h4 l0.74-2.96c0.73-0.27,1.4-0.66,2-1.14l2.92,0.83l2-3.46l-2.19-2.13c0.06-0.37,0.09-0.75,0.09-1.14s-0.03-0.77-0.09-1.14l2.19-2.13 l-2-3.46L16.74,6.1c-0.6-0.48-1.27-0.87-2-1.14L14,2L14,2z"></path></g>
      </svg>
                                        </div>
                                    </div>
                                    <span>V3 Settings</span>
                                </a>
                                <a id="st-polymer-startube-settings" class="st-polymer-menu-item flex-bar none">
                                    <div class="st-svg st-polymer-menu-svg">
                                        <div class="filled-icon">
                                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
<g id="settings_material">
    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.1-1.65c.2-.15.25-.42.13-.64l-2-3.46c-.12-.22-.4-.3-.6-.22l-2.5 1c-.52-.4-1.08-.73-1.7-.98l-.37-2.65c-.06-.24-.27-.42-.5-.42h-4c-.27 0-.48.18-.5.42l-.4 2.65c-.6.25-1.17.6-1.7.98l-2.48-1c-.23-.1-.5 0-.6.22l-2 3.46c-.14.22-.08.5.1.64l2.12 1.65c-.04.32-.07.65-.07.98s.02.66.06.98l-2.1 1.65c-.2.15-.25.42-.13.64l2 3.46c.12.22.4.3.6.22l2.5-1c.52.4 1.08.73 1.7.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.6-.25 1.17-.6 1.7-.98l2.48 1c.23.1.5 0 .6-.22l2-3.46c.13-.22.08-.5-.1-.64l-2.12-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path>
  </g>
  </svg>
                                        </div>
                                        <div class="outline-icon">
                                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
                                        <g id="settings"><path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,8c-2.21,0-4,1.79-4,4s1.79,4,4,4s4-1.79,4-4 S14.21,8,12,8L12,8z M13.22,3l0.55,2.2l0.13,0.51l0.5,0.18c0.61,0.23,1.19,0.56,1.72,0.98l0.4,0.32l0.5-0.14l2.17-0.62l1.22,2.11 l-1.63,1.59l-0.37,0.36l0.08,0.51c0.05,0.32,0.08,0.64,0.08,0.98s-0.03,0.66-0.08,0.98l-0.08,0.51l0.37,0.36l1.63,1.59l-1.22,2.11 l-2.17-0.62l-0.5-0.14l-0.4,0.32c-0.53,0.43-1.11,0.76-1.72,0.98l-0.5,0.18l-0.13,0.51L13.22,21h-2.44l-0.55-2.2l-0.13-0.51 l-0.5-0.18C9,17.88,8.42,17.55,7.88,17.12l-0.4-0.32l-0.5,0.14l-2.17,0.62L3.6,15.44l1.63-1.59l0.37-0.36l-0.08-0.51 C5.47,12.66,5.44,12.33,5.44,12s0.03-0.66,0.08-0.98l0.08-0.51l-0.37-0.36L3.6,8.56l1.22-2.11l2.17,0.62l0.5,0.14l0.4-0.32 C8.42,6.45,9,6.12,9.61,5.9l0.5-0.18l0.13-0.51L10.78,3H13.22 M14,2h-4L9.26,4.96c-0.73,0.27-1.4,0.66-2,1.14L4.34,5.27l-2,3.46 l2.19,2.13C4.47,11.23,4.44,11.61,4.44,12s0.03,0.77,0.09,1.14l-2.19,2.13l2,3.46l2.92-0.83c0.6,0.48,1.27,0.87,2,1.14L10,22h4 l0.74-2.96c0.73-0.27,1.4-0.66,2-1.14l2.92,0.83l2-3.46l-2.19-2.13c0.06-0.37,0.09-0.75,0.09-1.14s-0.03-0.77-0.09-1.14l2.19-2.13 l-2-3.46L16.74,6.1c-0.6-0.48-1.27-0.87-2-1.14L14,2L14,2z"></path></g>
      </svg>
                                        </div>
                                    </div>
                                    <span>{{lang[usedLang].stsets}}</span>
                                </a>
                                <a id="st-polymer-yt-settings" class="st-polymer-menu-item flex-bar" href="/account">
                                    <div class="st-svg st-polymer-menu-svg">
                                        <div class="filled-icon">
                                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
<g id="settings_material">
    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.1-1.65c.2-.15.25-.42.13-.64l-2-3.46c-.12-.22-.4-.3-.6-.22l-2.5 1c-.52-.4-1.08-.73-1.7-.98l-.37-2.65c-.06-.24-.27-.42-.5-.42h-4c-.27 0-.48.18-.5.42l-.4 2.65c-.6.25-1.17.6-1.7.98l-2.48-1c-.23-.1-.5 0-.6.22l-2 3.46c-.14.22-.08.5.1.64l2.12 1.65c-.04.32-.07.65-.07.98s.02.66.06.98l-2.1 1.65c-.2.15-.25.42-.13.64l2 3.46c.12.22.4.3.6.22l2.5-1c.52.4 1.08.73 1.7.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.6-.25 1.17-.6 1.7-.98l2.48 1c.23.1.5 0 .6-.22l2-3.46c.13-.22.08-.5-.1-.64l-2.12-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path>
  </g>
  </svg>
                                        </div>
                                        <div class="outline-icon">
                                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
                                        <g id="settings"><path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,8c-2.21,0-4,1.79-4,4s1.79,4,4,4s4-1.79,4-4 S14.21,8,12,8L12,8z M13.22,3l0.55,2.2l0.13,0.51l0.5,0.18c0.61,0.23,1.19,0.56,1.72,0.98l0.4,0.32l0.5-0.14l2.17-0.62l1.22,2.11 l-1.63,1.59l-0.37,0.36l0.08,0.51c0.05,0.32,0.08,0.64,0.08,0.98s-0.03,0.66-0.08,0.98l-0.08,0.51l0.37,0.36l1.63,1.59l-1.22,2.11 l-2.17-0.62l-0.5-0.14l-0.4,0.32c-0.53,0.43-1.11,0.76-1.72,0.98l-0.5,0.18l-0.13,0.51L13.22,21h-2.44l-0.55-2.2l-0.13-0.51 l-0.5-0.18C9,17.88,8.42,17.55,7.88,17.12l-0.4-0.32l-0.5,0.14l-2.17,0.62L3.6,15.44l1.63-1.59l0.37-0.36l-0.08-0.51 C5.47,12.66,5.44,12.33,5.44,12s0.03-0.66,0.08-0.98l0.08-0.51l-0.37-0.36L3.6,8.56l1.22-2.11l2.17,0.62l0.5,0.14l0.4-0.32 C8.42,6.45,9,6.12,9.61,5.9l0.5-0.18l0.13-0.51L10.78,3H13.22 M14,2h-4L9.26,4.96c-0.73,0.27-1.4,0.66-2,1.14L4.34,5.27l-2,3.46 l2.19,2.13C4.47,11.23,4.44,11.61,4.44,12s0.03,0.77,0.09,1.14l-2.19,2.13l2,3.46l2.92-0.83c0.6,0.48,1.27,0.87,2,1.14L10,22h4 l0.74-2.96c0.73-0.27,1.4-0.66,2-1.14l2.92,0.83l2-3.46l-2.19-2.13c0.06-0.37,0.09-0.75,0.09-1.14s-0.03-0.77-0.09-1.14l2.19-2.13 l-2-3.46L16.74,6.1c-0.6-0.48-1.27-0.87-2-1.14L14,2L14,2z"></path></g>
      </svg>
                                        </div>
                                    </div>
                                    <span>Settings</span>
                                </a>
                                <a id="st-polymer-help" class="st-polymer-menu-item flex-bar" href="https://support.google.com/youtube">
                                    <div class="st-svg st-polymer-menu-svg">
                                        <div class="filled-icon">
                                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
<g id="help">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"></path>
  </g>
  </svg>
                                        </div>
                                        <div class="outline-icon">
                                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
<g id="help"><path d="M15.36,9.96c0,1.09-0.67,1.67-1.31,2.24c-0.53,0.47-1.03,0.9-1.16,1.6L12.85,14h-1.75l0.03-0.28 c0.14-1.17,0.8-1.76,1.47-2.27c0.52-0.4,1.01-0.77,1.01-1.49c0-0.51-0.23-0.97-0.63-1.29c-0.4-0.31-0.92-0.42-1.42-0.29 c-0.59,0.15-1.05,0.67-1.19,1.34L10.32,10H8.57l0.06-0.42c0.2-1.4,1.15-2.53,2.42-2.87c1.05-0.29,2.14-0.08,2.98,0.57 C14.88,7.92,15.36,8.9,15.36,9.96z M12,18c0.55,0,1-0.45,1-1s-0.45-1-1-1s-1,0.45-1,1S11.45,18,12,18z M12,3c-4.96,0-9,4.04-9,9 s4.04,9,9,9s9-4.04,9-9S16.96,3,12,3 M12,2c5.52,0,10,4.48,10,10s-4.48,10-10,10S2,17.52,2,12S6.48,2,12,2L12,2z"></path></g>
</svg>
                                        </div>
                                    </div>
                                    <span>Help</span>
                                </a>
                                <a id="st-polymer-feedback" class="st-polymer-menu-item flex-bar" href="https://www.youtube.com/not_available">
                                    <div class="st-svg st-polymer-menu-svg">
                                        <div class="filled-icon">
                                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
<g id="feedback">
    <path d="M0 0h24v24H0z" fill="none"></path>
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"></path>
  </g>
  </svg>
                                        </div>
                                        <div class="outline-icon">
                                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
<g id="feedback"><path d="M13,14h-2v-2h2V14z M13,5h-2v6h2V5z M19,3H5v16.59l3.29-3.29L8.59,16H9h10V3 M20,2v15H9l-5,5V2H20L20,2z"></path></g>
</svg>
                                        </div>
                                    </div>
                                    <span>Send feedback</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div id="st-account-menu-main">
                        <div class="st-account-menu-header">
                            <span></span>
                        </div>
                        <div class="st-account-menu-content flex">
                            <a id="st-account-menu-pfp">
                                <img></img>
                            </a>
                            <div id="st-account-menu-details">
                                <div id="st-account-menu-username">
                                    <span></span>
                                </div>
                                <div id="st-account-menu-email">
                                    <span></span>
                                </div>
                                <div id="st-account-menu-sub-count">
                                    <span></span>
                                </div>
                                <div id="st-account-menu-buttons" class="flex-bar">
                                    <a id="st-account-menu-studio" class="" href="/dashboard">
                                        <span>Creator Studio</span>
                                    </a>
                                    <a id="st-account-menu-settings" href="/account" class="yt-uix-tooltip st-gear" title="YouTube settings">
                                        <span></span>
                                    </a>
                                    <a id="st-account-menu-startube-settings" class="yt-uix-tooltip st-gear" title="{{lang[usedLang].stsets}}">
                                        <span></span>
                                    </a>
                                    <a id="st-account-menu-v3-settings" class="yt-uix-tooltip st-gear" title="V3 settings">
                                        <span></span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="st-account-menu-other">
                        <div class="st-account-menu-header">
                            <span>Other accounts</span>
                        </div>
                        <div class="st-account-menu-content">
                        </div>
                    </div>
                    <div id="st-account-menu-appearance">
                        <div class="st-account-menu-content">
                            <div class="st-polymer-menu-section">
                                <div class="st-m-text">
                                    <span>Dark theme turns the light surfaces of the page dark, creating an experience ideal for night. Try it out!</span>
                                </div>
                                <div class="st-m-text">
                                    <span>Your Dark theme setting will apply to this browser only.</span>
                                </div>
                                <div class="st-m-toggle-cont flex-bar">
                                    <div class="st-m-toggle-label">
                                        <span>Dark theme</span>
                                    </div>
                                    <div class="st-m-toggle flex-bar" id="st-dark-tog">
                                        <div class="st-m-toggle-inner flex-bar">
                                            <div id="toggleBar"></div>
                                            <div id="toggleButton"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="st-account-menu-footer">
                    </div>
                    <div id="st-polymer-menu-account-footer" class="st-polymer-menu-section">
                        <a id="st-polymer-add-account" class="st-polymer-menu-item flex-bar" href="https://accounts.google.com/AddSession?continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26hl%3Den%26next%3D%252F&hl=en&passive=false&service=youtube&uilel=0">
                            <div class="st-svg st-polymer-menu-svg">
                                <div class="filled-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;">
                                    <g id="add_friend">
    <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
  </g> </svg>
                                </div>
                                <div class="outline-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="M13.72 11.93A4.004 4.004 0 0017 8c0-2.21-1.79-4-4-4S9 5.79 9 8c0 1.96 1.42 3.59 3.28 3.93C6.77 12.21 4 15.76 4 20h18c0-4.24-2.77-7.79-8.28-8.07zM10 8c0-1.65 1.35-3 3-3s3 1.35 3 3-1.35 3-3 3-3-1.35-3-3zm3 4.9c5.33 0 7.56 2.99 7.94 6.1H5.06c.38-3.11 2.61-6.1 7.94-6.1zM4 12H2v-1h2V9h1v2h2v1H5v2H4v-2z"></path></svg>
                                </div>
                            </div>
                            <span>Add account</span>
                        </a>
                        <a id="st-polymer-logout-2" class="st-polymer-menu-item flex-bar" href="/logout">
                            <div class="st-svg st-polymer-menu-svg">
                                <div class="filled-icon">
                                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
<g id="exit_app">
    <path d="M0 0h24v24H0z" fill="none"></path>
    <path d="M10.1 15.6l1.4 1.4 5-5-5-5-1.4 1.4 2.57 2.6H3v2h9.67l-2.58 2.6zM19 3H5c-1.1 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
  </g>
  </svg>
                                </div>
                                <div class="outline-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="M20 3v18H8v-1h11V4H8V3h12zm-8.9 12.1.7.7 4.4-4.4L11.8 7l-.7.7 3.1 3.1H3v1h11.3l-3.2 3.3z"></path></svg>
                                </div>
                            </div>
                            <span>Sign out</span>
                        </a>
                    </div>
                </div>`,
    cosmicGuideTop: `                <div id="startube-guide-top-left">
<a id="startube-guide-browse-button" class="stx-link" stx-ep="browse" stx-id="FEguide_builder" href="/feed/guide_builder">
    <span id="startube-guide-browse-icon"></span>
    <span id="startube-guide-browse-text">Browse Channels</span>
</a>
</div>
<div id="startube-guide-profile-section">
    <a id="startube-guide-pfp">
        <img></img>
    </a>
    <div id="startube-guide-profile-items">
        <a class="startube-guide-profile-item" id="st-g-my-channel">
            <span>My Channel</span>
            <span id="st-g-arrow"><span>
        </a>
        <a class="startube-guide-profile-item" id="st-g-my-videos">
            <span>My Videos</span>
        </a>
        <a class="startube-guide-profile-item stx-link" stx-ep="browse" stx-id="VLLL" id="st-g-likes" href="/playlist?list=LL">
            <span>Liked Videos</span>
        </a>
        <a class="startube-guide-profile-item stx-link" stx-ep="browse" stx-id="FEhistory" id="st-g-history" href="/feed/history">
            <span>History</span>
        </a>
        <a class="startube-guide-profile-item stx-link" stx-ep="browse" stx-id="VLWL" id="st-g-watch-later" href="/playlist?list=WL">
            <span>Watch Later</span>
        </a>
    </div>
</div>`,
    cosmicGuideSection: `<div class="guide-channels-content">
    <div class="guide-channels-list guide-item-container yt-uix-scroller yt-uix-tdl filter-has-matches parent-list guide-infinite-list optimized">
    <li id="recommended-guide-item" class="guide-channel"><a class="guide-item yt-uix-sessionlink yt-valign stx-link" stx-ep="browse" stx-id="FEwhat_to_watch" title="From YouTube" alt="my subscriptions" href="/feed/what_to_watch/recommended"><span class="yt-valign-container"><img class="thumb guide-my-subscriptions-icon" src="//s.ytimg.com/yts/img/pixel-vfl3z5WfW.gif"><span>&nbsp;</span><span class="display-name no-count"><span>From YouTube</span></span></span></a></div></li>
</div>`,
    relatedByline: `<span class="run run-text">by </span>
<span class="run run-text">
        <a class="chan-name"></a>
</span>`,
    createMenu: `                <div class="startube-menu-inner">
                <div class="startube-menu-section">
                    <a id="startube-create-video" href="/upload" class="startube-menu-item flex-bar">
                        <div class="startube-menu-item-icon">
                            <div class="st-svg">
                    <div class="filled-icon">
                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g id="creation_upload">
    <path d="M19,4H5A2.15,2.15,0,0,0,3,6V18a2.15,2.15,0,0,0,2,2H19a2.15,2.15,0,0,0,2-2V6A2.15,2.15,0,0,0,19,4ZM5,18H19V6H5Z" fill="#6f6f6f" fill-rule="evenodd"></path>
    <path d="M15,12,10,8v8Z" fill="#f80000" fill-rule="evenodd"></path>
  </g>
                    </div>
                    <div class="outline-icon">
                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
                    <g><path d="m10 8 6 4-6 4V8zm11-5v18H3V3h18zm-1 1H4v16h16V4z"></path></g>
                    </svg>
                    </div>
                    </div>
                        </div>
                        <div class="startube-menu-item-text">
                            <span>Upload video</span>
                        </div>
                    </a>
                    <a id="startube-create-live" href="/livestreaming" class="startube-menu-item flex-bar">
                        <div class="startube-menu-item-icon">
                                                        <div class="st-svg">
                    <div class="filled-icon">
                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g id="creation_live">
    <path d="M23,12a11,11,0,0,1-3.22,7.78l-1.41-1.41a9,9,0,0,0,0-12.73l1.41-1.41A11,11,0,0,1,23,12ZM5.64,5.64,4.22,4.22a11,11,0,0,0,0,15.56l1.41-1.41a9,9,0,0,1,0-12.73ZM16.95,7.05,15.54,8.46a5,5,0,0,1,0,7.07l1.41,1.41a7,7,0,0,0,0-9.9Zm-9.9,0a7,7,0,0,0,0,9.9l1.41-1.41a5,5,0,0,1,0-7.07Z" fill="#6f6f6f" fill-rule="evenodd"></path>
    <path d="M12,9a3,3,0,1,1-3,3,3,3,0,0,1,3-3" fill="#f80000" fill-rule="evenodd"></path>
  </g>
                    </div>
                    <div class="outline-icon">
                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
                    <g><path d="M14 12c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM8.48 8.45l-.71-.7C6.68 8.83 6 10.34 6 12s.68 3.17 1.77 4.25l.71-.71C7.57 14.64 7 13.39 7 12s.57-2.64 1.48-3.55zm7.75-.7-.71.71c.91.9 1.48 2.15 1.48 3.54s-.57 2.64-1.48 3.55l.71.71C17.32 15.17 18 13.66 18 12s-.68-3.17-1.77-4.25zM5.65 5.63l-.7-.71C3.13 6.73 2 9.24 2 12s1.13 5.27 2.95 7.08l.71-.71C4.02 16.74 3 14.49 3 12s1.02-4.74 2.65-6.37zm13.4-.71-.71.71C19.98 7.26 21 9.51 21 12s-1.02 4.74-2.65 6.37l.71.71C20.87 17.27 22 14.76 22 12s-1.13-5.27-2.95-7.08z"></path></g>
                    </svg>
                    </div>
                    </div>
                        </div>
                        <div class="startube-menu-item-text">
                            <span>Go live</span>
                        </div>
                    </a>
                    <a id="startube-create-post" href="" class="startube-menu-item flex-bar">
                        <div class="startube-menu-item-icon">
                                                                                    <div class="st-svg">
                    <div class="filled-icon">
                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g id="creation_post">
    <path d="M18,10v8H6V6h8l2-2H6A2.15,2.15,0,0,0,4,6V18a2.15,2.15,0,0,0,2,2H18a2.15,2.15,0,0,0,2-2V8Z" fill="#6f6f6f" fill-rule="evenodd"></path>
    <path d="M8,14v2h2l7-7L15,7ZM19.15,6.85a.5.5,0,0,0,0-.71L17.85,4.85a.5.5,0,0,0-.71,0L16,6l2,2Z" fill="#f80000" fill-rule="evenodd"></path>
  </g>
                    </div>
                    <div class="outline-icon">
                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
                    <g><path d="M15.01,7.34l1.64,1.64L8.64,17H6.99v-1.64L15.01,7.34 M15.01,5.92l-9.02,9.02V18h3.06l9.02-9.02L15.01,5.92L15.01,5.92z M17.91,4.43l1.67,1.67l-0.67,0.67L17.24,5.1L17.91,4.43 M17.91,3.02L15.83,5.1l3.09,3.09L21,6.11L17.91,3.02L17.91,3.02z M21,10h-1 v10H4V4h10V3H3v18h18V10z"></path></g>
                    </svg>
                    </div>
                    </div>
                        </div>
                        <div class="startube-menu-item-text">
                            <span>Create post</span>
                        </div>
                    </a>
                    <a id="startube-create-menu-v3-settings" class="startube-menu-item flex-bar">
<div class="startube-menu-item-icon">
    <div class="st-svg">
        <div class="filled-icon">
            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
                <g id="settings_material">
                    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.1-1.65c.2-.15.25-.42.13-.64l-2-3.46c-.12-.22-.4-.3-.6-.22l-2.5 1c-.52-.4-1.08-.73-1.7-.98l-.37-2.65c-.06-.24-.27-.42-.5-.42h-4c-.27 0-.48.18-.5.42l-.4 2.65c-.6.25-1.17.6-1.7.98l-2.48-1c-.23-.1-.5 0-.6.22l-2 3.46c-.14.22-.08.5.1.64l2.12 1.65c-.04.32-.07.65-.07.98s.02.66.06.98l-2.1 1.65c-.2.15-.25.42-.13.64l2 3.46c.12.22.4.3.6.22l2.5-1c.52.4 1.08.73 1.7.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.6-.25 1.17-.6 1.7-.98l2.48 1c.23.1.5 0 .6-.22l2-3.46c.13-.22.08-.5-.1-.64l-2.12-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path>
                </g>
            </svg>
        </div>
        <div class="outline-icon">
            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
                <g id="settings"><path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,8c-2.21,0-4,1.79-4,4s1.79,4,4,4s4-1.79,4-4 S14.21,8,12,8L12,8z M13.22,3l0.55,2.2l0.13,0.51l0.5,0.18c0.61,0.23,1.19,0.56,1.72,0.98l0.4,0.32l0.5-0.14l2.17-0.62l1.22,2.11 l-1.63,1.59l-0.37,0.36l0.08,0.51c0.05,0.32,0.08,0.64,0.08,0.98s-0.03,0.66-0.08,0.98l-0.08,0.51l0.37,0.36l1.63,1.59l-1.22,2.11 l-2.17-0.62l-0.5-0.14l-0.4,0.32c-0.53,0.43-1.11,0.76-1.72,0.98l-0.5,0.18l-0.13,0.51L13.22,21h-2.44l-0.55-2.2l-0.13-0.51 l-0.5-0.18C9,17.88,8.42,17.55,7.88,17.12l-0.4-0.32l-0.5,0.14l-2.17,0.62L3.6,15.44l1.63-1.59l0.37-0.36l-0.08-0.51 C5.47,12.66,5.44,12.33,5.44,12s0.03-0.66,0.08-0.98l0.08-0.51l-0.37-0.36L3.6,8.56l1.22-2.11l2.17,0.62l0.5,0.14l0.4-0.32 C8.42,6.45,9,6.12,9.61,5.9l0.5-0.18l0.13-0.51L10.78,3H13.22 M14,2h-4L9.26,4.96c-0.73,0.27-1.4,0.66-2,1.14L4.34,5.27l-2,3.46 l2.19,2.13C4.47,11.23,4.44,11.61,4.44,12s0.03,0.77,0.09,1.14l-2.19,2.13l2,3.46l2.92-0.83c0.6,0.48,1.27,0.87,2,1.14L10,22h4 l0.74-2.96c0.73-0.27,1.4-0.66,2-1.14l2.92,0.83l2-3.46l-2.19-2.13c0.06-0.37,0.09-0.75,0.09-1.14s-0.03-0.77-0.09-1.14l2.19-2.13 l-2-3.46L16.74,6.1c-0.6-0.48-1.27-0.87-2-1.14L14,2L14,2z"></path></g>
            </svg>
        </div>
    </div>
</div>
<div class="startube-menu-item-text">
    <span>V3 Settings</span>
</div>
</a>
                </div>
                </div>`,
    appsIcon: `              <div id="startube-apps-svg">
                  <div class="st-svg">
                  <div class="filled-icon">
                  <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
  <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" class="style-scope yt-icon"></path>
</g></svg>
                  </div>
                  <div class="outline-icon">
                  <div class="regular-icon">
                  <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
                  <g><path d="M16,4v4h4V4H16z M19,7h-2V5h2V7z M16,10v4h4v-4H16z M19,13h-2v-2h2V13z M10,4v4h4V4H10z M13,7h-2V5h2V7z M10,10v4h4v-4H10z M13,13h-2v-2h2V13z M16,16v4h4v-4H16z M19,19h-2v-2h2V19z M10,16v4h4v-4H10z M13,19h-2v-2h2V19z M4,4v4h4V4H4z M7,7H5V5h2V7z M4,10 v4h4v-4H4z M7,13H5v-2h2V13z M4,16v4h4v-4H4z M7,19H5v-2h2V19z"></path></g>
                  </svg>
                  </div>
                  <div class="active-icon">
                  <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
                  <g><path d="M16,4v4h4V4H16z M16,10v4h4v-4H16z M10,4v4h4V4H10z M10,10v4h4v-4H10z M16,16v4h4v-4H16z M10,16v4h4v-4H10z M4,4v4h4V4H4z M4,10v4h4v-4H4z M4,16v4h4v-4H4z"></path></g>
                  </svg>
                  </div>
                  </div>
                  </div>
              </div>`,
    appsMenu: `                <div class="startube-menu-inner">
                    <div class="startube-menu-section">
                        <a id="startube-ytapp-tv" href="https://tv.youtube.com" class="startube-menu-item flex-bar">
                            <div class="startube-menu-item-icon">
                                <div class="st-svg">
                                    <div class="filled-icon">
                                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
                                        <g class="style-scope yt-icon">
                                            <path fill="#F00" d="M23.8,17.1c0,0.9-0.7,1.6-1.6,1.6H1.9c-0.9,0-1.6-0.7-1.6-1.6V4.8c0-0.9,0.7-1.6,1.6-1.6 h20.3c0.9,0,1.6,0.7,1.6,1.6V17.1z" class="style-scope yt-icon"></path>
                                            <path fill="#F00" d="M17.3,20.8H6.7c-0.3,0-0.5-0.2-0.5-0.5v0c0-0.3,0.2-0.5,0.5-0.5h10.7 c0.3,0,0.5,0.2,0.5,0.5v0C17.9,20.6,17.6,20.8,17.3,20.8z" class="style-scope yt-icon"></path>
                                            <polygon fill="#FFFFFF" points="9.6,14.4 15.7,10.9 9.6,7.5" class="style-scope yt-icon"></polygon>
                                        </g>
                                    </svg>
                                    </div>
                                    <div class="outline-icon">
                                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
                                        <g class="style-scope yt-icon"><path fill="#FF0000" d="M6,18h12v1H6V18z M22,6.2v9.6c0,0.66-0.54,1.2-1.2,1.2H3.2C2.54,17,2,16.46,2,15.8V6.2C2,5.54,2.54,5,3.2,5 h17.6C21.46,5,22,5.54,22,6.2z" class="style-scope yt-icon"></path><polygon fill="#FFFFFF" points="15,11 10,8.35 10,13.65 " class="style-scope yt-icon"></polygon></g>
                                    </svg>
                                    </div>
                                </div>
                            </div>
                            <div class="startube-menu-item-text">
                                <span>YouTube TV</span>
                            </div>
                        </a>
                        <a id="startube-ytapp-gaming" href="https://gaming.youtube.com" class="startube-menu-item flex-bar">
                            <div class="startube-menu-item-icon">
                                <div class="st-svg">
                                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
                                        <g fill-rule="evenodd" class="style-scope yt-icon">
    <path d="m 17.46,3.7145456 -4.92,2.7981819 c -0.332727,0.1909091 -0.741818,0.1909091 -1.08,0 L 6.54,3.7145456 C 6.3709091,3.6218184 6.1854545,3.5454548 6,3.5454548 c -0.1854545,0 -0.3709091,0.076364 -0.54,0.1690908 L 0.55090909,6.5018184 C 0.21272726,6.6981821 0,7.058182 0,7.4509093 V 13.68 c 0,0.392728 0.21272726,0.752728 0.55090909,0.949091 L 11.46,20.825455 C 11.629091,20.923636 11.814545,21 12,21 c 0.185455,0 0.37091,-0.07636 0.54,-0.169091 L 23.449091,14.634546 C 23.792727,14.438182 24,14.078182 24,13.685455 V 7.4509093 C 24,7.058182 23.787273,6.6981821 23.449091,6.5018184 L 18.54,3.7145456 C 18.370909,3.6218184 18.185455,3.5454548 18,3.5454548 c -0.185455,0 -0.370909,0.076364 -0.54,0.1690908 z" fill="#f00" class="style-scope yt-icon"></path>
    <path d="m 18.136364,4.0909093 0,6.1363637 5.318181,-3.1363637 z" fill="#fff" class="style-scope yt-icon"></path>
  </g>
                                    </svg>
                                </div>
                            </div>
                            <div class="startube-menu-item-text">
                                <span>YouTube Gaming</span>
                            </div>
                        </a>
                    </div>
                    <div class="startube-menu-section">
                        <a id="startube-ytapp-music" href="https://music.youtube.com" class="startube-menu-item flex-bar">
                            <div class="startube-menu-item-icon">
                                <div class="st-svg">
                                <div class="filled-icon">
                                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
                                        <g fill-rule="nonzero" fill="none" class="style-scope yt-icon">
    <circle fill="red" cx="12" cy="12" r="12" class="style-scope yt-icon"></circle>
    <path d="M12 6.278A5.728 5.728 0 0 1 17.722 12 5.728 5.728 0 0 1 12 17.722 5.728 5.728 0 0 1 6.278 12 5.728 5.728 0 0 1 12 6.278zm0-.55A6.272 6.272 0 0 0 5.727 12 6.272 6.272 0 0 0 12 18.273 6.272 6.272 0 0 0 18.273 12 6.272 6.272 0 0 0 12 5.727z" fill="#FFF" class="style-scope yt-icon"></path>
    <path fill="#FFF" d="M9.818 15.136l5.318-3.272-5.318-3z" class="style-scope yt-icon"></path>
  </g>
                                    </svg>
                                </div>
                                </div>
                                <div class="st-svg">
                                <div class="outline-icon">
                                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
<g class="style-scope yt-icon"><circle fill="#FF0000" cx="12" cy="12" r="10" class="style-scope yt-icon"></circle><polygon fill="#FFFFFF" points="10,14.65 10,9.35 15,12 " class="style-scope yt-icon"></polygon><path fill="#FFFFFF" d="M12,7c2.76,0,5,2.24,5,5s-2.24,5-5,5s-5-2.24-5-5S9.24,7,12,7 M12,6c-3.31,0-6,2.69-6,6s2.69,6,6,6s6-2.69,6-6 S15.31,6,12,6L12,6z" class="style-scope yt-icon"></path></g>
                                    </svg>
                                </div>
                                </div>
                            </div>
                            <div class="startube-menu-item-text">
                                <span>YouTube Music</span>
                            </div>
                        </a>
                        <a id="startube-ytapp-kids" href="https://kids.youtube.com" class="startube-menu-item flex-bar">
                            <div class="startube-menu-item-icon">
                                <div class="st-svg">
                                <div class="filled-icon">
                                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
<g class="style-scope yt-icon">
    <path fill="#282828" d="M16.38 10.69c-.04-.02-.09-.03-.13-.05-1.35-.65-5.69-2.07-6.55-2.32-.15-.05-.59-.18-.76-.05-.16.12-.06.63-.04.78.07.5.7 5.03.77 5.5l.01.09c.06.4.16 1.21.39 1.33.23.12.82-.27 1.13-.52 0 0 3.68-2.6 4.31-3.05l.82-.58.1-.07c.19-.12.42-.26.41-.57 0-.31-.27-.42-.46-.49zm-5.88 4.44c-.23-.83-.89-5.11-.95-6.12.97.12 5.1 1.58 6.34 2.25-.24.17-4.76 3.52-5.39 3.87z" class="style-scope yt-icon"></path><path fill="#F00" d="M23.29 13.89c-.04-1.1-.36-5.29-.43-5.8-.13-.93-.37-1.8-.69-2.6-.21-.52-.52-1.05-1.31-1.61-1.01-.72-1.82-.84-2.85-.84-.72 0-1.21.04-1.53.06-2.59.18-4.95.46-7.22.86-2.01.36-3.53.76-4.92 1.3-1.04.41-1.85.92-2.48 1.57C.83 7.88.56 8.85.79 10.01c.3 1.58.8 5.23.82 5.43.11.97.28 2.1.67 3.2.44 1.21 1.25 1.94 2.48 2.23.79.19 1.61.13 2.68-.12 1.44-.34 2.87-.67 4.33-.93 2.47-.45 4.78-.58 5.78-.64.45-.03 1.52-.12 1.61-.13.24-.03.56-.09.88-.15.82-.18 1.43-.61 1.99-1.15.27-.26.61-.69.82-1.11.44-.93.47-1.91.44-2.75zm-6.85-2.14c-.04.02-.07.04-.1.07-.28.19-.55.38-.82.58-.63.45-4.31 3.05-4.31 3.05-.31.25-.9.63-1.13.52-.23-.12-.33-.93-.39-1.33l-.01-.09c-.08-.48-.7-5.01-.77-5.5-.03-.15-.13-.66.03-.78.17-.13.61 0 .76.05.87.25 5.2 1.67 6.56 2.32.04.02.08.04.13.05.19.08.46.18.47.5 0 .3-.23.45-.42.56z" class="style-scope yt-icon"></path><path fill="#FFF" d="M15.9 11.26c-.25.17-4.77 3.52-5.4 3.87-.23-.83-.89-5.11-.95-6.12.98.12 5.1 1.58 6.35 2.25z" class="style-scope yt-icon"></path><path fill="#FF8983" d="M.76 9.91c.23-1.61 1.07-2.16 1.67-2.6 1.01-.75 1.88-1.16 3.3-1.55C9.75 4.65 12.16 4.33 16.3 4.2c1.11-.03 2.89-.12 3.92.37.83.39 1.5.86 2.3 1.92-.1-.34-.21-.67-.34-.99-.21-.52-.52-1.05-1.31-1.61-1.01-.72-1.82-.84-2.85-.84-.66 0-1.12.03-1.44.06-.03 0-.06.01-.09.01-2.59.18-4.95.46-7.22.86-2.01.36-3.53.76-4.92 1.3-1.05.39-1.86.9-2.49 1.55-.09.1-.18.19-.26.29C.81 8.03.59 8.9.76 9.91z" class="style-scope yt-icon"></path><path fill="#282828" d="M23.98 13.48c-.02-.58-.27-4.7-.37-5.37-.17-1.1-.37-2.16-.85-3.14-.48-.97-.91-1.52-1.63-1.92-1.33-.73-2.15-.84-4.09-.77-.96.04-6.6.72-7.83.93-2.06.35-3.7.78-5.17 1.36-1.01.4-1.82.89-2.46 1.49C.23 7.32-.24 8.7.11 10.38c.26 1.29.69 4.81.75 5.26.13.98.31 2.13.73 3.26.57 1.54 1.63 2.44 3.25 2.75.29.06.58.08.89.08.47.01 1.26-.12 1.88-.27.32-.08 1.34-.32 3.28-.73 3.2-.68 7.04-.88 7.77-.94.11-.01 1-.07 1.34-.13 1.35-.25 2.17-1.03 2.96-1.85.47-.49.9-1.36.99-2.25.07-.76.05-1.43.03-2.08zm-1.14 3.15c-.21.43-.55.85-.82 1.11-.57.54-1.17.96-1.99 1.15-.31.07-.63.13-.88.15-.09.01-1.17.1-1.61.13-1 .06-3.31.18-5.78.64-1.46.27-2.89.6-4.33.93-1.06.25-1.88.31-2.68.12-1.23-.3-2.04-1.03-2.48-2.23-.4-1.09-.56-2.23-.67-3.2-.02-.2-.51-3.85-.82-5.43-.22-1.15.05-2.12 1.08-3.17.63-.65 1.44-1.16 2.48-1.57 1.39-.54 2.91-.94 4.92-1.3 2.27-.4 4.63-.69 7.22-.86.32-.02.81-.06 1.53-.06 1.03 0 1.85.12 2.85.84.79.57 1.1 1.09 1.31 1.61.32.8.56 1.67.69 2.6.07.51.39 4.7.43 5.8.03.84 0 1.82-.45 2.74z" class="style-scope yt-icon"></path>
  </g>
                                    </svg>
                                </div>
                                </div>
                                <div class="st-svg">
                                <div class="outline-icon">
                                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
<g class="style-scope yt-icon"><path fill="#FF0000" d="M21.39,13.19c0-0.08,0-0.15,0-0.22c-0.01-0.86-0.5-5-0.78-5.74c-0.32-0.85-0.76-1.5-1.31-1.91 c-0.9-0.67-1.66-0.82-2.6-0.84l-0.02,0c-0.4,0-3.01,0.32-5.2,0.62C9.28,5.4,6.53,5.8,5.88,6.04c-0.9,0.33-1.62,0.77-2.19,1.33 c-1.05,1.04-1.18,2.11-1.04,3.51c0.1,1.09,0.69,5.37,1.02,6.35c0.45,1.32,1.33,2.12,2.47,2.24c0.28,0.03,0.55,0.05,0.82,0.05 c1,0,1.8-0.21,2.72-0.46c1.45-0.39,3.25-0.87,6.97-0.87l0.09,0h0.02c0.91,0,3.14-0.2,4.16-2.07C21.44,15.12,21.41,13.91,21.39,13.19 z" class="style-scope yt-icon"></path><path fill="#000" d="M21.99,13.26c0-0.08,0-0.16-0.01-0.24c-0.01-0.92-0.54-5.32-0.83-6.11c-0.34-0.91-0.81-1.59-1.4-2.03 C18.81,4.17,17.99,4.02,17,4l-0.02,0c-0.43,0-3.21,0.34-5.54,0.66c-2.33,0.32-5.25,0.75-5.95,1C4.53,6.01,3.76,6.48,3.16,7.08 c-1.12,1.1-1.25,2.25-1.11,3.74c0.11,1.16,0.73,5.71,1.08,6.75c0.48,1.41,1.41,2.25,2.63,2.38C6.06,19.98,6.34,20,6.63,20 c1.07,0,1.91-0.23,2.89-0.49c1.54-0.41,3.46-0.93,7.41-0.93l0.1,0h0.02c0.97,0,3.34-0.21,4.42-2.2 C22.04,15.32,22.01,14.03,21.99,13.26z M20.59,15.91c-0.82,1.51-2.75,1.68-3.56,1.68l-0.1,0c-4.09,0-6.07,0.53-7.67,0.96 C8.31,18.8,7.56,19,6.63,19c-0.25,0-0.5-0.01-0.76-0.04c-1.04-0.11-1.54-0.99-1.79-1.71c-0.3-0.88-0.91-5.21-1.04-6.53 C2.9,9.25,3.1,8.54,3.86,7.79c0.5-0.5,1.15-0.89,1.97-1.19c0.17-0.06,1.1-0.32,5.74-0.95C14.2,5.29,16.64,5.01,16.99,5 c0.83,0.02,1.43,0.13,2.17,0.69c0.43,0.32,0.79,0.86,1.06,1.58c0.22,0.58,0.76,4.78,0.77,5.77l0.01,0.25 C21.01,13.96,21.04,15.08,20.59,15.91z" class="style-scope yt-icon"></path><path fill="#000" d="M11.59,14.76c-0.48,0.36-0.8,0.45-1.01,0.45c-0.16,0-0.25-0.05-0.3-0.08c-0.34-0.18-0.42-0.61-0.5-1.2l-0.01-0.1 c-0.04-0.31-0.26-2.1-0.38-3.16L9.3,9.94C9.26,9.66,9.2,9.19,9.54,8.94c0.32-0.23,0.75-0.09,0.96-0.03c0.53,0.17,3.6,1.23,4.59,1.73 c0.21,0.09,0.67,0.28,0.68,0.83c0.01,0.5-0.38,0.74-0.53,0.82L11.59,14.76z" class="style-scope yt-icon"></path><path fill="#FFF" d="M10.3,9.89c0,0,0.5,4.08,0.51,4.19c0.06-0.04,3.79-2.58,3.79-2.58C13.71,11.07,11.07,10.14,10.3,9.89z" class="style-scope yt-icon"></path></g>
                                    </svg>
                                </div>
                                </div>
                            </div>
                            <div class="startube-menu-item-text">
                                <span>YouTube Kids</span>
                            </div>
                        </a>
                    </div>
                    <div class="startube-menu-section">
                        <a id="startube-ytapp-ca" href="https://creatoracademy.youtube.com/page/education" class="startube-menu-item flex-bar">
                            <div class="startube-menu-item-icon">
                                <div class="st-svg">
                                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
<g class="style-scope yt-icon">
    <defs class="style-scope yt-icon">
      <radialGradient cx="5.4%" cy="7.11%" r="107.93%" fx="5.4%" fy="7.11%" gradientTransform="matrix(.70653 0 0 1 .016 0)" class="style-scope yt-icon">
        <stop offset="0%" stop-color="#FFF" class="style-scope yt-icon"></stop>
        <stop offset="100%" stop-color="#FFF" stop-opacity="0" class="style-scope yt-icon"></stop>
      </radialGradient>
    </defs>
    <g fill="none" fill-rule="evenodd" class="style-scope yt-icon">
      <path d="M1 1h21.77v22H1z" class="style-scope yt-icon"></path>
      <g fill-rule="nonzero" class="style-scope yt-icon">
        <path fill="#F00" d="M22.54 7.6s-.2-1.5-.86-2.17c-.83-.87-1.75-.88-2.18-.93-3.04-.22-7.6-.2-7.6-.2s-4.56-.02-7.6.2c-.43.05-1.35.06-2.18.93-.65.67-.86 2.18-.86 2.18S1.04 9.4 1 11.18v1.66c.04 1.78.26 3.55.26 3.55s.2 1.5.86 2.18c.83.87 1.9.84 2.4.94 1.7.15 7.2.2 7.38.2 0 0 4.57 0 7.6-.22.43-.05 1.35-.06 2.18-.93.65-.67.86-2.18.86-2.18s.22-1.77.24-3.55v-1.66c-.02-1.78-.24-3.55-.24-3.55z" class="style-scope yt-icon"></path>
        <path fill="#FAFAFA" d="M9.68 8.9v6.18l5.84-3.1" class="style-scope yt-icon"></path>
        <path fill="#000" fill-opacity=".12" d="M9.68 8.88l5.13 3.48.73-.38" class="style-scope yt-icon"></path>
        <path fill="#FFF" fill-opacity=".2" d="M22.54 7.6s-.2-1.5-.86-2.17c-.83-.87-1.75-.88-2.18-.93-3.04-.22-7.6-.2-7.6-.2s-4.56-.02-7.6.2c-.43.05-1.35.06-2.18.93-.65.67-.86 2.18-.86 2.18S1.04 9.4 1 11.18v.1c.04-1.76.26-3.54.26-3.54s.2-1.5.86-2.17c.83-.88 1.75-.88 2.18-.93 3.04-.22 7.6-.2 7.6-.2s4.56-.02 7.6.2c.43.05 1.35.05 2.18.93.65.66.86 2.17.86 2.17s.22 1.78.23 3.55v-.1c0-1.8-.23-3.56-.23-3.56z" class="style-scope yt-icon"></path>
        <path fill="#3E2723" fill-opacity=".2" d="M22.54 16.4s-.2 1.5-.86 2.17c-.83.87-1.75.88-2.18.93-3.04.22-7.6.2-7.6.2s-4.56.02-7.6-.2c-.43-.05-1.35-.06-2.18-.93-.65-.67-.86-2.18-.86-2.18s-.22-1.8-.26-3.57v-.1c.04 1.76.26 3.54.26 3.54s.2 1.5.86 2.17c.83.88 1.75.88 2.18.93 3.04.22 7.6.2 7.6.2s4.56.02 7.6-.2c.43-.05 1.35-.05 2.18-.93.65-.66.86-2.17.86-2.17s.22-1.78.23-3.55v.1c0 1.8-.23 3.56-.23 3.56z" class="style-scope yt-icon"></path>
        <path fill="#FFF" fill-opacity=".2" d="M9.68 15.08v.1l5.84-3.08v-.12" class="style-scope yt-icon"></path>
        <path fill="#3E2723" fill-opacity=".2" d="M9.68 8.9v-.13l5.84 3.1v.1" class="style-scope yt-icon"></path>
        <path fill="url(#a)" fill-opacity=".1" d="M21.54 3.4s-.2-1.5-.86-2.18C19.85.35 18.93.35 18.5.3 15.46.07 10.9.1 10.9.1S6.34.07 3.3.3c-.43.05-1.35.05-2.18.92C.47 1.9.26 3.4.26 3.4S.04 5.17 0 6.95V8.6c.04 1.8.26 3.56.26 3.56s.2 1.52.86 2.18c.83.87 1.9.85 2.4.94 1.7.16 7.2.2 7.38.2 0 0 4.57 0 7.6-.2.43-.06 1.35-.07 2.18-.94.65-.66.86-2.18.86-2.18s.22-1.77.24-3.55V6.97c-.02-1.78-.24-3.55-.24-3.55z" transform="translate(1 4.208)" class="style-scope yt-icon"></path>
      </g>
    </g>
  </g>
                                    </svg>
                                </div>
                            </div>
                            <div class="startube-menu-item-text">
                                <span>Creator Academy</span>
                            </div>
                        </a>
                        <a id="startube-ytapp-yfa" href="https://artists.youtube.com" class="startube-menu-item flex-bar">
                            <div class="startube-menu-item-icon">
                                <div class="st-svg">
                                 <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
<g class="style-scope yt-icon">
    <defs class="style-scope yt-icon">
      <radialGradient cx="5.4%" cy="7.11%" r="107.93%" fx="5.4%" fy="7.11%" gradientTransform="matrix(.70653 0 0 1 .016 0)" class="style-scope yt-icon">
        <stop offset="0%" stop-color="#FFF" class="style-scope yt-icon"></stop>
        <stop offset="100%" stop-color="#FFF" stop-opacity="0" class="style-scope yt-icon"></stop>
      </radialGradient>
    </defs>
    <g fill="none" fill-rule="evenodd" class="style-scope yt-icon">
      <path d="M1 1h21.77v22H1z" class="style-scope yt-icon"></path>
      <g fill-rule="nonzero" class="style-scope yt-icon">
        <path fill="#F00" d="M22.54 7.6s-.2-1.5-.86-2.17c-.83-.87-1.75-.88-2.18-.93-3.04-.22-7.6-.2-7.6-.2s-4.56-.02-7.6.2c-.43.05-1.35.06-2.18.93-.65.67-.86 2.18-.86 2.18S1.04 9.4 1 11.18v1.66c.04 1.78.26 3.55.26 3.55s.2 1.5.86 2.18c.83.87 1.9.84 2.4.94 1.7.15 7.2.2 7.38.2 0 0 4.57 0 7.6-.22.43-.05 1.35-.06 2.18-.93.65-.67.86-2.18.86-2.18s.22-1.77.24-3.55v-1.66c-.02-1.78-.24-3.55-.24-3.55z" class="style-scope yt-icon"></path>
        <path fill="#FAFAFA" d="M9.68 8.9v6.18l5.84-3.1" class="style-scope yt-icon"></path>
        <path fill="#000" fill-opacity=".12" d="M9.68 8.88l5.13 3.48.73-.38" class="style-scope yt-icon"></path>
        <path fill="#FFF" fill-opacity=".2" d="M22.54 7.6s-.2-1.5-.86-2.17c-.83-.87-1.75-.88-2.18-.93-3.04-.22-7.6-.2-7.6-.2s-4.56-.02-7.6.2c-.43.05-1.35.06-2.18.93-.65.67-.86 2.18-.86 2.18S1.04 9.4 1 11.18v.1c.04-1.76.26-3.54.26-3.54s.2-1.5.86-2.17c.83-.88 1.75-.88 2.18-.93 3.04-.22 7.6-.2 7.6-.2s4.56-.02 7.6.2c.43.05 1.35.05 2.18.93.65.66.86 2.17.86 2.17s.22 1.78.23 3.55v-.1c0-1.8-.23-3.56-.23-3.56z" class="style-scope yt-icon"></path>
        <path fill="#3E2723" fill-opacity=".2" d="M22.54 16.4s-.2 1.5-.86 2.17c-.83.87-1.75.88-2.18.93-3.04.22-7.6.2-7.6.2s-4.56.02-7.6-.2c-.43-.05-1.35-.06-2.18-.93-.65-.67-.86-2.18-.86-2.18s-.22-1.8-.26-3.57v-.1c.04 1.76.26 3.54.26 3.54s.2 1.5.86 2.17c.83.88 1.75.88 2.18.93 3.04.22 7.6.2 7.6.2s4.56.02 7.6-.2c.43-.05 1.35-.05 2.18-.93.65-.66.86-2.17.86-2.17s.22-1.78.23-3.55v.1c0 1.8-.23 3.56-.23 3.56z" class="style-scope yt-icon"></path>
        <path fill="#FFF" fill-opacity=".2" d="M9.68 15.08v.1l5.84-3.08v-.12" class="style-scope yt-icon"></path>
        <path fill="#3E2723" fill-opacity=".2" d="M9.68 8.9v-.13l5.84 3.1v.1" class="style-scope yt-icon"></path>
        <path fill="url(#a)" fill-opacity=".1" d="M21.54 3.4s-.2-1.5-.86-2.18C19.85.35 18.93.35 18.5.3 15.46.07 10.9.1 10.9.1S6.34.07 3.3.3c-.43.05-1.35.05-2.18.92C.47 1.9.26 3.4.26 3.4S.04 5.17 0 6.95V8.6c.04 1.8.26 3.56.26 3.56s.2 1.52.86 2.18c.83.87 1.9.85 2.4.94 1.7.16 7.2.2 7.38.2 0 0 4.57 0 7.6-.2.43-.06 1.35-.07 2.18-.94.65-.66.86-2.18.86-2.18s.22-1.77.24-3.55V6.97c-.02-1.78-.24-3.55-.24-3.55z" transform="translate(1 4.208)" class="style-scope yt-icon"></path>
      </g>
    </g>
  </g>
                                    </svg>
                                </div>
                            </div>
                            <div class="startube-menu-item-text">
                                <span>YouTube for Artists</span>
                            </div>
                        </a>
                    </div>
                </div>`,
    notifIcon: `              <div class="filled-icon">
              <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope iron-icon"><g class="style-scope iron-icon">
  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" class="style-scope iron-icon"></path>
</g></svg>
              </div>
              <div class="outline-icon">
              <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
              <path d="M10 20h4c0 1.1-.9 2-2 2s-2-.9-2-2zm10-2.65V19H4v-1.65l2-1.88v-5.15C6 7.4 7.56 5.1 10 4.34v-.38c0-1.42 1.49-2.5 2.99-1.76.65.32 1.01 1.03 1.01 1.76v.39c2.44.75 4 3.06 4 5.98v5.15l2 1.87zm-1 .42-2-1.88v-5.47c0-2.47-1.19-4.36-3.13-5.1-1.26-.53-2.64-.5-3.84.03C8.15 6.11 7 7.99 7 10.42v5.47l-2 1.88V18h14v-.23z" class="style-scope yt-icon"></path></g></svg>
              </div>`,
    aozoraLinks: `<a class="aozora-topbar-link stx-link" stx-ep="browse" stx-id="FEwhat_to_watch" href="/feed/what_to_watch/recommended">
    <span class="run">Browse</span>
</a>
<a class="aozora-topbar-link" href="/movies">
    <span class="run">Movies</span>
</a>
<a class="aozora-topbar-link" href="/upload">
    <span class="run">Upload</span>
</a>`,
    stargazerHeader: `<div id="stargazer-header-inner">
    <div id="stargazer-tabbed-header" class="st-sth">
        <div class="stargazer-header-upper">
            <div class="stargazer-toplinks" class="flex">
                <a class="stargazer-toplink signed-out" href="/account">
                    <b>Sign up</b>
                </a>
                <a class="stargazer-toplink signed-out" href="/account">
                    <span>Log in</span>
                </a>
                <a class="stargazer-user-container stargazer-toplink signed-in">
                    <b class="run"></b>
                </a>
            </div>
        </div>
        <div class="stargazer-header-middle flex">
            <div class="stargazer-logo-container">
            </div>
            <div class="stargazer-tabs flex">
                <a id="stargazer-home" class="stargazer-tab active stx-link" stx-ep="browse" stx-id="FEwhat_to_watch" href="/">
                    <span>Home</span>
                </a>
                <a id="stargazer-videos" class="stargazer-tab stx-link" stx-ep="browse" stx-id="FEsubscriptions" href="/feed/subscriptions?flow=grid">
                    <span>Videos</span>
                </a>
                <a id="stargazer-channels" class="stargazer-tab stx-link" stx-ep="browse" stx-id="FEguide_builder" href="/feed/guide_builder">
                    <span>Channels</span>
                </a>
                <a id="stargazer-community" class="stargazer-tab stx-link" stx-ep="browse" stx-id="FEsocial" href="/feed/social">
                    <span>Community</span>
                </a>
            </div>
        </div>
        <div class="stargazer-header-lower flex-bar">
            <div class="stargazer-header-lower-inner flex-bar">
                <div class="stargazer-search-container">
                </div>
                <div class="stargazer-upload">
                    <a class="stargazer-button stargazer-yellow-button" href="/upload">
                        <span>Upload</span>
                    </a>
                </div>
                <div class="cloudgazer-powered">
                </div>
            </div>
        </div>
    </div>
    <div id="stargazer-bar-header" class="st-sbh">
        <div class="stargazer-header-upper flex-bar">
            <div class="stargazer-logo-container">
            </div>
            <div class="stargazer-logo-companion">
                <div class="stargazer-slogan">
                </div>
                <div class="stargazer-logo-links flex">
                    <a class="stargazer-country stargazer-logo-link">Worldwide</a>
                    <a class="stargazer-language stargazer-logo-link">English</a>
                </div>
            </div>
            <div class="stargazer-toplinks" class="flex">
                <a class="stargazer-toplink signed-out" href="/account">
                    <b>Sign up</b>
                </a>
                <a class="stargazer-toplink signed-out" href="/account">
                    <span>Log in</span>
                </a>
                <a class="stargazer-user-container stargazer-toplink signed-in">
                    <b class="run"></b>
                </a>
            </div>
        </div>
        <div class="stargazer-header-lower flex-bar">
            <div class="stargazer-navs flex">
                <a id="stargazer-home" class="stargazer-nav stx-link" stx-ep="browse" stx-id="FEwhat_to_watch" href="/feed/what_to_watch/recommended">
                    <span>Home</span>
                </a>
                <a id="stargazer-videos" class="stargazer-nav stx-link" stx-ep="browse" stx-id="FEhistory" href="/feed/history">
                    <span>Videos</span>
                </a>
                <a id="stargazer-history" class="stargazer-nav none stx-link" stx-ep="browse" stx-id="FEsubscriptions" href="/feed/subscriptions?flow=grid">
                    <span>History</span>
                </a>
                <a id="stargazer-shows" class="stargazer-nav none stx-link" stx-ep="browse" stx-id="FEmovies" href="/movies">
                    <span>Shows</span>
                </a>
                <a id="stargazer-channels" class="stargazer-nav stx-link" stx-ep="browse" stx-id="FEguide_builder" href="/feed/guide_builder">
                    <span>Channels</span>
                </a>
                <a id="stargazer-community" class="stargazer-nav stx-link" stx-ep="browse" stx-id="FEsocial" href="/feed/social">
                    <span>Community</span>
                </a>
            </div>
            <div class="stargazer-search-container">
            </div>
            <div id="stargazer-upload-dd" class="flex">
                <a class="stargazer-upload stargazer-button stargazer-yellow-button stargazer-shiny-button" href="/upload">
                    <span>Upload</span>
                </a>
                <button id="stargazer-upload-dropdown" class="stargazer-button stargazer-yellow-button stargazer-shiny-button">
                    <span></span>
                </button>
                <div id="stargazer-upload-menu-container">
                    <div id="stargazer-upload-fence" class="st-fence"></div>
                    <div id="stargazer-upload-menu" class="stargazer-menu">
                    <a class="stargazer-menu-item" href="/upload">
                        <span>Video File</span>
                    </a>
                    <a class="stargazer-menu-item" href="/livestreaming">
                        <span>Go Live</span>
                    </a>
                    <a id="stargazer-v3-settings" class="stargazer-menu-item">
                        <span>V3 Settings</span>
                    </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="stargazer-simple-header" class="st-ssh flex-bar">
        <div class="stargazer-logo-container">
        </div>
        <div class="stargazer-simple-header-inner">
        <div class="stargazer-header-upper flex-bar">
            <div class="stargazer-search-container">
            </div>
            <div class="stargazer-toplinks" class="flex">
                <a class="stargazer-toplink signed-out" href="/account">
                    <b>Create Account</b>
                </a>
                <span class="or-text signed-out"> or </span>
                <a class="stargazer-toplink signed-out" href="/account">
                    <span>Sign In</span>
                </a>
                <a class="stargazer-user-container stargazer-toplink signed-in">
                    <b class="run"></b>
                </a>
            </div>
        </div>
        <div class="stargazer-header-lower flex-bar">
            <div class="stargazer-links flex">
                <a id="stargazer-home" class="stargazer-link stx-link" stx-ep="browse" stx-id="FEwhat_to_watch" href="/">
                    <span>Home</span>
                </a>
                <a id="stargazer-videos" class="stargazer-link stx-link" stx-ep="browse" stx-id="FEwhat_to_watch" href="/feed/what_to_watch/recommended">
                    <span>Videos</span>
                </a>
                <a id="stargazer-channels" class="stargazer-link stx-link" stx-ep="browse" stx-id="FEguide_builder" href="/feed/guide_builder">
                    <span>Channels</span>
                </a>
                <a id="stargazer-community" class="stargazer-link stx-link" stx-ep="browse" stx-id="FEsocial" href="/feed/social">
                    <span>Community</span>
                </a>
                <a id="stargazer-shows" class="stargazer-link none stx-link" stx-ep="browse" stx-id="FEmovies" href="/movies">
                    <span>Shows</span>
                </a>
            </div>
            <div class="stargazer-links-right flex-bar">
                <a id="stargazer-subs" class="stargazer-link stx-link" stx-ep="browse" stx-id="FEsubscriptions" href="/feed/subscriptions">
                    <span>Subscriptions</span>
                </a>
                <a id="stargazer-history" class="stargazer-link stx-link" stx-ep="browse" stx-id="FEhistory" href="/feed/history">
                    <span>History</span>
                </a>
                <a id="stargazer-upload" class="stargazer-button stargazer-yellow-button stargazer-small-button stargazer-shiny-button" href="/upload">
                    <span>Upload</span>
                </a>
            </div>
        </div>
        </div>
    </div>
</div>`,
    stargazerFeedHeader: `<div class="stargazer-feed-header">
    <div class="stargazer-feed-header-top flex">
        <div class="stargazer-feed-header-text">
            <span>Featured Videos</span>
        </div>
        <div class="stargazer-feed-header-actions">
            <a href="/feed/hype_leaderboard" class="stargazer-feed-top-link">
                <span>See more featured videos</span>
            </a>
        </div>
    </div>
    <div class="stargazer-feed-header-bottom flex-bar">
        <div class="stargazer-feed-header-links flex-bar">
            <a id="stf-featured" href="/feed/what_to_watch/recommended" class="stargazer-feed-link disabled">
                <span>Featured</span>
            </a>
            <a id="stf-history" href="/feed/history" class="stargazer-feed-link">
                <span>Watch History</span>
            </a>
            <a id="stf-liked" href="/playlist?list=LL" class="stargazer-feed-link">
                <span>Liked Videos</span>
            </a>
            <a id="stf-watch-later" href="/playlist?list=WL" class="stargazer-feed-link">
                <span>Watch Later</span>
            </a>
        </div>
    </div>
</div>`,
    cosmicFeedHeader: `<div class="epic-feed-header flex-bar">
    <div class="epic-feed-header-icon">
    </div>
    <div class="epic-feed-header-text">
        <span>{{title}}</span>
    </div>
    <div class="epic-feed-header-actions">
    </div>
</div>`,
    aozoraSearchHeader: `<div id="aozora-search-header-inner">
    <div id="aozora-sh-top">
        <span>Search results for </span>
        <b>{{searchValue}}</b>
    </div>
    <div id="aozora-sh-middle">
        <span>About </span>
        <b>{{resultCount}}</b>
        <span> results</span>
    </div>
    <div id="aozora-sh-bottom">
        <b>“{{searchValue}}”</b>
        <span>results </span>
        <b>1</b>
        <span> - </span>
        <b>20</b>
        <span> of about </span>
        <b>{{resultCount}}</b>
    </div>
</div>
<hr class="horizontal-rule"></hr>`,
    filterIcon: `              <div id="startube-filter-svg">
                  <div class="st-svg">
                  <div class="filled-icon">
                  <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon">
  <path d="M0 0h24v24H0z" fill="none" class="style-scope yt-icon"></path>
  <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" class="style-scope yt-icon"></path>
</g></svg>
                  </div>
                  <div class="outline-icon">
                  <div class="regular-icon">
                  <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon"><path d="M15,17h6v1h-6V17z M11,17H3v1h8v2h1v-2v-1v-2h-1V17z M14,8h1V6V5V3h-1v2H3v1h11V8z M18,5v1h3V5H18z M6,14h1v-2v-1V9H6v2H3v1 h3V14z M10,12h11v-1H10V12z" class="style-scope yt-icon"></path></g></svg>
                  </div>
                  <div class="active-icon">
                  <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon"><path d="M15,17h6v2h-6V17z M11,17H3v2h8v2h2v-6h-2V17z M14,9h2V3h-2v2H3v2h11V9z M18,5v2h3V5H18z M6,15h2V9H6v2H3v2h3V15z M10,13h11 v-2H10V13z" class="style-scope yt-icon"></path></g></svg>
                  </div>
                  </div>
                  </div>
              </div>`,
    homeTab: `<h2 class="epic-nav-item-heading">Home</h2>`,
    homeTabLink: `<a class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-epic-nav-item" href="{{navUrl}}"><span class="yt-uix-button-content"><span class="run">Home</span></span></a>`,
};
function fill(tpl, values) {
    return tpl.replace(/\{\{(\w+)\}\}/g, function(m, k) {
        const v = values[k];
        return v === undefined || v === null ? "" : String(v);
    });
}
