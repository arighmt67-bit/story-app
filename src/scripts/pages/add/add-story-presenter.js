export default class AddStoryPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async submit({ description, photo, lat, lon }) {
    this.#view.setSubmitting(true);
    try {
      await this.#model.addStory({ description, photo, lat, lon });
      this.#view.onSuccess();
    } catch (error) {
      this.#view.showError(error.message);
    } finally {
      this.#view.setSubmitting(false);
    }
  }
}
