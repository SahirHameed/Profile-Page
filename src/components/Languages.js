import React, { useState } from "react";
import { Fade } from "react-awesome-reveal";
import contentData from "../content.json";

const Languages = () => {
  const { languages } = contentData;
  const languageItems = languages.language_items;
  const softwareItems = languages.framework_items;

  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (item) => {
    setModalContent(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <section className="Languages-section">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <Fade triggerOnce={true} bottom>
              <div className="title-box text-center">
                <h3 className="title-a" id="languages">
                  {languages.section.title}
                </h3>
                <p className="subtitle-a">{languages.section.description}</p>
              </div>
            </Fade>
          </div>
        </div>

        {/* Languages Section */}
        <Fade triggerOnce={true} bottom>
          <div className="row">
            <div className="col-sm-12">
              <h4>Languages</h4>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "25px", // Increase the spacing
                  fontSize: "1.1rem", // Slightly larger font
                  fontWeight: "500", // Enhance the font weight
                }}
              >
                {languageItems.map((language, index) => (
                  <span
                    key={index}
                    onClick={() => openModal(language)}
                    style={{ cursor: "pointer", padding: "5px 10px" }} // Add padding for better clickability
                  >
                    {language.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Fade>

        {/* Software Section */}
        <Fade triggerOnce={true} bottom>
          <div className="row" style={{ marginTop: "20px" }}>
            <div className="col-sm-12">
              <h4>Software</h4>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "25px", // Same gap for consistency
                  fontSize: "1.1rem", // Slightly larger font
                  fontWeight: "500", // Enhance the font weight
                }}
              >
                {softwareItems.map((software, index) => (
                  <span
                    key={index}
                    onClick={() => openModal(software)}
                    style={{ cursor: "pointer", padding: "5px 10px" }} // Add padding for better clickability
                  >
                    {software.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Fade>

        {/* Modal Section */}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <h4>{modalContent.name}</h4>
              {/* Add more details about the language or software here */}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Languages;
