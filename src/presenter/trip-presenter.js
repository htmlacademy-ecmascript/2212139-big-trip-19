import { render, replace } from '../framework/render.js';
import TripListView from '../view/trip-list.js';
import EditPointView from '../view/edit-point.js';
import PointView from '../view/trip-point.js';
import EmptyListView from '../view/empty-list.js';
import { PointState } from '../const.js';
import { getSelectedDestination, getSelectedOffers, getOffersByType, isEscKey } from '../utils/point.js';

export default class EventsPresenter {

  #eventListContainer = new TripListView();
  #pointsModel = [];
  #destinationsModel = [];
  #offersModel = [];
  #eventsContainer = null;
  #eventPoints = [];
  #destinations = [];
  #offers = [];

  constructor(eventsContainer, PointsModel, DestinationsModel, OffersModel) {
    this.#pointsModel = PointsModel;
    this.#destinationsModel = DestinationsModel;
    this.#offersModel = OffersModel;
    this.#eventsContainer = eventsContainer;
  }


  #renderPoint = (point, destination, allDestinations, offers, allOffers) => {

    const onEscKeyDown = (evt) => {
      if (isEscKey(evt)) {
        evt.preventDefault();
        replaceFormToCard.call(this);
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    const closeForm = () => {
      replaceFormToCard.call(this);
      document.removeEventListener('keydown', onEscKeyDown);
    };

    const pointComponent = new PointView(point, destination, offers);

    pointComponent.setEditBtnClickHandler(() => {
      replaceCardToForm.call(this);
      document.addEventListener('keydown', onEscKeyDown);
    });

    const pointEditComponent = new EditPointView(PointState.EDIT, point, allDestinations, allOffers);

    pointEditComponent.setFormSubmitHandler(() => {
      closeForm();
    });

    pointEditComponent.setCloseButtonClickHandler(() => {
      closeForm();
    });

    function replaceCardToForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToCard() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#eventListContainer.element);
  };


  #renderEvens() {
    if (!this.#eventPoints.length) {
      render(new EmptyListView(), this.#eventsContainer);
      return null;
    }

    render(this.#eventListContainer, this.#eventsContainer);
    //this.#renderEditPoint(PointState.ADD, this.#eventPoints, this.#destinations, this.#offers);

    for (let i = 0; i < this.#eventPoints.length; i++) {

      const offersPoint = getOffersByType(this.#offers, this.#eventPoints[i].type);
      const selectedDestination = getSelectedDestination(this.#destinations, this.#eventPoints[i].destination);
      const selectedOffers = getSelectedOffers(offersPoint, this.#eventPoints[i].offers);

      this.#renderPoint(this.#eventPoints[i], selectedDestination, this.#destinations, selectedOffers, offersPoint);
    }
  }

  init = () => {

    this.#eventPoints = [...this.#pointsModel.points];
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];


    this.#renderEvens();

  };
}
