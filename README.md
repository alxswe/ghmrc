# GHMRC - GitHub Multi-Repository Cloner

Simplify your repository management with the **GHMRC**! This project streamlines the process of adding, removing, and syncing repositories, ensuring a smooth and efficient cloning experience for developers.

## Table of Contents

- [Introduction](#introduction)

- [Features](#features)

- [Tech Stack](#tech-stack)

- [Architecture](#architecture)

- [Getting Started](#getting-started)

- [Challenges Overcome](#challenges-overcome)

- [Key Takeaways](#key-takeaways)

- [License](#license)

## Introduction

**GHMRC** is a web application designed to enhance the management of multiple repositories. Whether you're a solo developer or part of a team, this tool offers a user-friendly interface to add, remove, and monitor the cloning progress of repositories in real-time.

## Features

- Effortless Repository Management:

  - Add new repositories with ease.

  - Remove repositories that are no longer needed.

  - Real-time synchronisation using django-channels.

- Real-time updates:

  - Monitor the progress of the cloning process for each repository.

  - Receive real-time updates on the overall status.

  - Notifications for any errors or issues during cloning.

## Tech Stack

- Frontend:
  
  - Next.js
  
  - TailwindUI

- Backend:
  
  - Django
  
  - Django Rest Framework (Rest API)

- Asynchronous Communication:
  
  - Redis
  
  - Celery
  
  - Memcached

- Database:
  
  - PostgreSQL (for data persistence)

## Architecture

​​![](https://lh7-us.googleusercontent.com/f0zN67eCwLAXrtJpne_u4ljZ0T1I_PLBTy0i0Lj3feWty8Q08NYwe9rnoVOlVkR-ft3TXhmPHcfitybaMheoHZVqUDggaeraPAaep2F1EbD_e-p0uJqCg0rTsYVHDEiQpmYW4dBDEPWz-Xtp4ork)

The project's architecture ensures seamless communication between the frontend and backend, leveraging the power of Django for server-side operations, Redis for asynchronous communication, and PostgreSQL as the main RDBMS.

## Getting Started

To get started with the GHMRC:

```shell
docker run alxswe/ghmrc
```

## Challenges Overcome

The coding journey wasn't without its challenges. From communication barriers to tech stack adjustments, we navigated through hurdles and emerged victorious.

## Key Takeaways

Our coding adventure taught us valuable lessons about asynchronous communication, distributed task execution, and the importance of adaptability in a tech stack.

## License

This project is licensed under the [MIT License](https://opensource.org/license/mit/) - see the [LICENSE](https://github.com/alxswe/ghmrc/blob/master/LICENSE) file for details.

----------

Happy cloning with the GHMRC!
