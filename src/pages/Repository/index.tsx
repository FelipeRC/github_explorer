import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Header, RepositoryInfo, Issues } from './styles';

import logoImg from '../../assets/logo.svg';
import api from '../../services/api';

interface RepositoryParams {
  repository: string;
}

interface Repository {
  // eslint-disable-next-line camelcase
  full_name: string;
  description: string;
  forks_count: number;
  stargazers_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    // eslint-disable-next-line camelcase
    avatar_url: string;
  };
}

interface Issue {
  id: number;
  title: string;
  body: string;
  html_url: string;
  user: {
    login: string;
  };
}

const Repository: React.FC = () => {
  const { params } = useRouteMatch<RepositoryParams>();

  const [repository, setRepository] = useState<Repository | null>();
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    api.get(`repos/${params.repository}`).then(response => {
      setRepository(response.data);
    });
    api.get(`repos/${params.repository}/issues`).then(response => {
      console.log(response.data);
      setIssues(response.data);
    });
  }, [params]);

  return (
    <>
      <Header>
        <img src={logoImg} alt="Github Explorer" srcSet="" />
        <Link to="/">
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>

      {repository ? (
        <RepositoryInfo>
          <header>
            <img
              src={repository?.owner.avatar_url}
              alt={repository?.owner.login}
            />
            <div>
              <strong>{repository?.full_name}</strong>
              <p>{repository?.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repository?.stargazers_count}</strong>
              <span>Stars</span>
            </li>
            <li>
              <strong>{repository?.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repository?.open_issues_count}</strong>
              <span>Issues abertas</span>
            </li>
          </ul>
        </RepositoryInfo>
      ) : (
        <p>Carregando...</p>
      )}
      <Issues>
        {issues.map(issue => (
          <a href={issue.html_url} key={issue.id}>
            <div>
              <strong>{issue.title}</strong>
              <p>{issue.user.login}</p>
            </div>

            <FiChevronRight size={20} />
          </a>
        ))}
      </Issues>
    </>
  );
};

export default Repository;
