import React, { useState } from "react";
import contentData from "../content.json";

const Languages = () => {
  const { languages } = contentData;
  const languageItems = languages.language_items;
  const frameworkItems = languages.framework_items;

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
            <div className="title-box text-center">
              <h3 className="title-a" id="languages">
                {languages.section.title}
              </h3>
              <p className="subtitle-a">{languages.section.description}</p>
            </div>
          </div>
        </div>

        <div className="row">
          <h4>Programming Languages</h4>
          {languageItems.map((language, index) => (
            <div
              key={index}
              className="col-sm-4 text-center"
              onClick={() => openModal(language)}
              style={{ cursor: "pointer" }}
            >
              <p>{language.name}</p>
            </div>
          ))}
        </div>

        <div className="row">
          <h4>Frameworks & Platforms</h4>
          {frameworkItems.map((framework, index) => (
            <div
              key={index}
              className="col-sm-4 text-center"
              onClick={() => openModal(framework)}
              style={{ cursor: "pointer" }}
            >
              <p>{framework.name}</p>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <h4>{modalContent.name}</h4>
              {/* You can add more details about the language or framework here */}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Languages;
