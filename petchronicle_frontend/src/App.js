import React, { useState } from "react";
import "./App.css";

// PUBLIC_INTERFACE
function App() {
  // Profile image, navigation, and basic states
  const [profileImg, setProfileImg] = useState(null);
  const [nav, setNav] = useState("timeline");
  const [memories, setMemories] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [scrapDescriptions, setScrapDescriptions] = useState({});
  const [shareLink, setShareLink] = useState("");

  // Handle pet profile image upload
  // PUBLIC_INTERFACE
  function handleProfileImg(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setProfileImg(ev.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  // Memory add and update
  // PUBLIC_INTERFACE
  function addMemory(memory) {
    setMemories((prev) => [...prev, { ...memory, date: new Date() }]);
    if (memory.photo) {
      setPhotos((prev) => [...prev, memory.photo]);
    }
  }

  // PUBLIC_INTERFACE
  function addPhoto(photo) {
    setPhotos((prev) => [...prev, photo]);
  }
  // PUBLIC_INTERFACE
  function addMilestone(milestone) {
    setMilestones((prev) => [...prev, { ...milestone, date: new Date() }]);
  }

  // Navigation titles and links
  const NAVS = [
    { id: "timeline", label: "Timeline" },
    { id: "photos", label: "Photos" },
    { id: "milestones", label: "Milestones" },
    { id: "scrapbook", label: "Scrapbook" },
  ];

  // PUBLIC_INTERFACE
  function generateShareLink() {
    // Sample: This would be server-backed in prod
    setShareLink(`https://mypetchronicle.io/story/${Math.floor(Math.random() * 100000)}`);
  }

  // Scrapbook editing
  // PUBLIC_INTERFACE
  function editScrapDesc(itemKey, desc) {
    setScrapDescriptions((prev) => ({
      ...prev,
      [itemKey]: desc,
    }));
  }

  return (
    <div className="petchronicle-app">
      <nav className="pc-navbar">
        <div className="pc-logo" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <PawIcon />
          <span className="pc-title">PetChronicle</span>
        </div>
        <div className="pc-navlinks">
          {NAVS.map((n) => (
            <button
              key={n.id}
              className={`pc-navbtn${nav === n.id ? " selected" : ""}`}
              onClick={() => setNav(n.id)}
              aria-current={nav === n.id ? "page" : undefined}
            >
              {n.label}
            </button>
          ))}
        </div>
        <div>
          <ShareStoryBtn onShare={generateShareLink} shareLink={shareLink} />
        </div>
      </nav>
      <main className="pc-main">

        <section className="pc-hero">
          <div className="pc-profile-image-container">
            <label htmlFor="profile-upload" className="pc-profile-upload-label" title="Upload your pet's photo">
              {profileImg ? (
                <img src={profileImg} className="pc-profile-img" alt="Pet Profile" />
              ) : (
                <div className="pc-profile-placeholder">
                  <PawIcon size={48} />
                  <span style={{ fontSize: 14, color: "var(--pc-secondary)" }}>Add Pet Photo</span>
                </div>
              )}
              <input
                id="profile-upload"
                type="file"
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleProfileImg}
              />
            </label>
          </div>
          <div className="pc-hero-content">
            <h1>Welcome to PetChronicle!</h1>
            <div className="pc-desc">
              Capture, organize, and share your pet's memories. Start by uploading a profile image and storing their precious moments.
            </div>
          </div>
        </section>

        <section className="pc-router-section">
          {nav === "timeline" && (
            <Timeline
              memories={memories}
              onAddMemory={addMemory}
            />
          )}
          {nav === "photos" && (
            <Photos
              photos={photos}
              onAddPhoto={addPhoto}
            />
          )}
          {nav === "milestones" && (
            <Milestones
              milestones={milestones}
              onAddMilestone={addMilestone}
            />
          )}
          {nav === "scrapbook" && (
            <Scrapbook
              memories={memories}
              photos={photos}
              milestones={milestones}
              scrapDescriptions={scrapDescriptions}
              onEditDesc={editScrapDesc}
            />
          )}
        </section>

      </main>
    </div>
  );
}

// Paw icon for pet-friendly branding
// PUBLIC_INTERFACE
function PawIcon({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="var(--pc-accent)"
      xmlns="http://www.w3.org/2000/svg"
      style={{ verticalAlign: "middle" }}
    >
      <ellipse cx="16" cy="15" rx="5" ry="7"/>
      <ellipse cx="32" cy="15" rx="5" ry="7"/>
      <ellipse cx="24" cy="36" rx="15" ry="9"/>
      <ellipse cx="8" cy="28" rx="4" ry="6"/>
      <ellipse cx="40" cy="28" rx="4" ry="6"/>
    </svg>
  );
}



// PUBLIC_INTERFACE
function Timeline({ memories, onAddMemory }) {
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div className="pc-timeline">
      <div className="pc-section-header">
        <h2>Timeline</h2>
        <button className="pc-action-btn" onClick={() => setShowAdd((v) => !v)}>
          {showAdd ? "Cancel" : "Add Memory"}
        </button>
      </div>
      {showAdd && <AddMemoryForm onAdd={onAddMemory} />}
      <div className="pc-timeline-list">
        {memories.length === 0 && (
          <div className="pc-list-empty">No memories yet. Start your timeline!</div>
        )}
        {memories.slice().sort((a, b) => (b.date - a.date)).map((m, idx) => (
          <div key={idx} className="pc-timeline-memory">
            {m.photo && <img src={m.photo} className="pc-timeline-photo" alt="memory visual" />}
            <div>
              <div className="pc-timeline-text">{m.text}</div>
              <div className="pc-timeline-date">{formatDate(m.date)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function AddMemoryForm({ onAdd }) {
  const [memoryText, setMemoryText] = useState("");
  const [photoFile, setPhotoFile] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (memoryText.trim() === "") return;
    const memory = { text: memoryText, photo: photoFile };
    onAdd(memory);
    setMemoryText("");
    setPhotoFile(null);
  }

  function handlePhoto(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoFile(ev.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  return (
    <form className="pc-form" onSubmit={handleSubmit}>
      <textarea
        placeholder="Write a memory about your pet..."
        value={memoryText}
        onChange={(e) => setMemoryText(e.target.value)}
        rows={2}
      />
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: 8 }}>
        <label className="pc-upload-label">
          <input type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
          <span className="pc-photo-btn">+ Photo</span>
        </label>
        {photoFile && (
          <img
            src={photoFile}
            alt="preview"
            style={{ width: 42, height: 42, borderRadius: 6, objectFit: "cover", border: "1px solid var(--pc-secondary)" }}
          />
        )}
        <button className="pc-action-btn" type="submit">Add</button>
      </div>
    </form>
  );
}


// PUBLIC_INTERFACE
function Photos({ photos, onAddPhoto }) {
  // Upload handler
  function handlePhoto(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => onAddPhoto(ev.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  }
  return (
    <div className="pc-section">
      <div className="pc-section-header">
        <h2>Photos</h2>
        <label className="pc-action-btn pc-upload-label">
          Upload Photo
          <input type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
        </label>
      </div>
      {photos.length === 0 && <div className="pc-list-empty">No photos yet. Upload your best pet moments!</div>}
      <div className="pc-photo-grid">
        {photos.map((photo, idx) => (
          <img key={idx} src={photo} className="pc-photo-thumb" alt={`pet photo ${idx+1}`} />
        ))}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function Milestones({ milestones, onAddMilestone }) {
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div className="pc-section">
      <div className="pc-section-header">
        <h2>Milestones</h2>
        <button className="pc-action-btn" onClick={() => setShowAdd((v) => !v)}>
          {showAdd ? "Cancel" : "Add Milestone"}
        </button>
      </div>
      {showAdd && <AddMilestoneForm onAdd={onAddMilestone} />}
      <div className="pc-milestones-list">
        {milestones.length === 0 && (
          <div className="pc-list-empty">No milestones yet. Celebrate the big moments!</div>
        )}
        {milestones.slice().sort((a, b) => (b.date - a.date)).map((m, idx) => (
          <div key={idx} className="pc-milestone-item">
            <span className="pc-milestone-title">{m.title}</span>
            <span className="pc-milestone-date">{formatDate(m.date)}</span>
            {m.desc && <div className="pc-milestone-desc">{m.desc}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}


// PUBLIC_INTERFACE
function AddMilestoneForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    if (title.trim() === "") return;
    onAdd({ title, desc });
    setTitle("");
    setDesc("");
  }
  return (
    <form className="pc-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Milestone title (e.g., First Bark, Birthday...)"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        maxLength={64}
      />
      <input
        type="text"
        placeholder="Optional description"
        value={desc}
        onChange={e => setDesc(e.target.value)}
        maxLength={200}
      />
      <button className="pc-action-btn" type="submit">Add Milestone</button>
    </form>
  );
}


// PUBLIC_INTERFACE
function Scrapbook({ memories, photos, milestones, scrapDescriptions, onEditDesc }) {
  // All items as a combined list
  const combined = [
    ...milestones.map(m => ({ type: "milestone", title: m.title, date: m.date, desc: m.desc })),
    ...memories.map(m => ({ type: "memory", text: m.text, date: m.date, photo: m.photo })),
    ...photos.map(ph => ({ type: "photo", photo: ph }))
  ]
    .sort((a, b) => (b.date?.getTime?.() || 0) - (a.date?.getTime?.() || 0));

  // For printable
  function handlePrint() { window.print(); }

  return (
    <div className="pc-section">
      <div className="pc-section-header">
        <h2>Scrapbook</h2>
        <button className="pc-action-btn" onClick={handlePrint}>Print</button>
      </div>
      {combined.length === 0 && <div className="pc-list-empty">No entries yet.</div>}
      <div className="pc-scrapbook-grid">
        {combined.map((item, idx) => {
          let key = `scrap-${idx}`;
          return (
            <div key={key} className="pc-scrapbook-entry">
              {item.photo && <img src={item.photo} className="pc-scrapbook-photo" alt="" />}
              <div>
                {item.type === "milestone" && (
                  <>
                    <span className="pc-milestone-title">{item.title}</span>
                    <span className="pc-milestone-date">{formatDate(item.date)}</span>
                  </>
                )}
                {item.type === "memory" && (
                  <>
                    <div className="pc-timeline-text">{item.text}</div>
                    <div className="pc-timeline-date">{formatDate(item.date)}</div>
                  </>
                )}
              </div>
              <textarea
                className="pc-scrap-desc"
                placeholder="Enter description for this scrapbook entry..."
                value={scrapDescriptions[key] || ""}
                onChange={e => onEditDesc(key, e.target.value)}
                rows={3}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}


// PUBLIC_INTERFACE
function ShareStoryBtn({ onShare, shareLink }) {
  return (
    <div className="pc-share-section">
      <button className="pc-action-btn pc-share-btn" onClick={onShare}>
        Share Story
      </button>
      {shareLink && (
        <span className="pc-share-link">
          <a href={shareLink} target="_blank" rel="noopener noreferrer">
            {shareLink}
          </a>
        </span>
      )}
    </div>
  );
}

// Utility function for formatting
function formatDate(date) {
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    if (!d || isNaN(d.getTime())) return "";
    return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default App;
