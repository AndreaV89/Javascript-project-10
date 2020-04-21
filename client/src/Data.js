import config from './config';

export default class Data {
  /**
   * Method used to make the requests to the REST API.
   * @param {string} path - Base URL of API. 
   * @param {string} method - The HTTP method of the request.
   * @param {object} body - Contain any data associated with the request.
   * @param {boolean} requiresAuth - If the request need authentication or not.
   * @param {object} credentials - Authentication credentials if 'requiresAuth' is true.
   * @returns {function} fetch - fetch resources using provided options and params.
   */
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;
  
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    // If the request need authentication, encode user credentials using Bacis Auth
    if (requiresAuth) {
      const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);

      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }

    return fetch(url, options);
  }

  /**
   * GetUser method - retrieve the current authenticated user from the database.
   * @param {string} username - emailAddress of the user. 
   * @param {string} password - password of the user.
   */
  async getUser(username, password) {
    const response = await this.api(`/users`, 'GET', null, true, { username, password });
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 401) {
      return null;
    }
    else {
      throw new Error();
    }
  }
  
  /**
   * CreateUser method - create a new user.
   * @param {object} user - user provided information.
   */
  async createUser(user) {
    const response = await this.api('/users', 'POST', user);
    if (response.status === 201) {
      return [];
    }
    else if (response.status === 400 || response.status === 409) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }

  /**
   * GetCourses method - retrieve all courses in the database.
   */
  async getCourses() {
    const response = await this.api('/courses');
    if (response.status === 200) {
      return response.json().then(data => data);
    } 
    else if (response.status === 500) {
      return null;
    }
    else {
      throw new Error();
    }
  }

  /**
   * GetCourse method - retrieve the selected course details.
   * @param {number} id - id of the selected course. 
   */
  async getCourse(id) {
    const response = await this.api(`/courses/${id}`);
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 404) {
      return null;
    }
    else {
      throw new Error();
    }
  }

  /**
   * CreateCourse method - Create a new course.
   * @param {object} course - Provided info about the course.
   * @param {string} username - Username of the user for authentication.
   * @param {string} password - Password of the user for authentication.
   */
  async createCourse(course, username, password) {
    const response = await this.api('/courses', 'POST', course, true, { username, password });
    if (response.status === 201) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }

  /**
   * UpdateCourse - Update details of the selected course.
   * @param {object} course - New provided info about the course. 
   * @param {string} username - Username of the user for authentication.
   * @param {string} password - Password of the user for authentication.
   */
  async updateCourse(course, username, password) {
    const response = await this.api(`/courses/${course.id}`, 'PUT', course, true, { username, password });
    if (response.status === 204) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else if (response.status === 403) {
      return response.status;
    }
    else if (response.status === 404) {
      return null;
    }
    else {
      throw new Error();
    }
  }

  /**
   * DeleteCourse - Delete the selected course.
   * @param {object} course - Selected course.
   * @param {string} username - Username of the user for authentication.
   * @param {string} password - Password of the user for authentication.
   */
  async deleteCourse(course, username, password) {
    const response = await this.api(`/courses/${course.id}`, 'DELETE', null, true, { username, password });
    if (response.status === 204) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }
}
