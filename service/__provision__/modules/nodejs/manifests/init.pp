class nodejs {
	require system

	package { 'nodejs':
		ensure => installed
	}

	package { 'nodejs-legacy':
		ensure => installed
	}

	package { 'npm':
		ensure  => installed,
		require => Exec['apt update']
	}
}